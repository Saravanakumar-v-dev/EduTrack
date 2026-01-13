// server/middleware/auditLogger.js
import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userEmail: String,
    action: {
        type: String,
        required: true,
        enum: ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'VIEW'],
    },
    resource: {
        type: String,
        required: true, // e.g., 'User', 'Grade', 'Report'
    },
    resourceId: String,
    details: String,
    ipAddress: String,
    userAgent: String,
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILURE'],
        default: 'SUCCESS',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// Middleware to log actions
export const logAudit = (action, resource) => {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = function (data) {
            // Create audit log
            const log = {
                userId: req.user?._id,
                userEmail: req.user?.email,
                action,
                resource,
                resourceId: req.params.id || req.body?.id,
                details: JSON.stringify(req.body).substring(0, 500), // Limit size
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
                status: res.statusCode < 400 ? 'SUCCESS' : 'FAILURE',
            };

            AuditLog.create(log).catch(err =>
                console.error('Audit log error:', err)
            );

            originalSend.call(this, data);
        };

        next();
    };
};

// Get audit logs (admin only)
export const getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, userId, action, startDate, endDate } = req.query;

        const query = {};
        if (userId) query.userId = userId;
        if (action) query.action = action;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await AuditLog.find(query)
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('userId', 'name email role');

        const count = await AuditLog.countDocuments(query);

        res.json({
            logs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching audit logs' });
    }
};

export default AuditLog;
