import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const BarChart = ({ data, title, colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
            )}

            <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={{ stroke: '#4b5563' }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={{ stroke: '#4b5563' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                            color: '#fff',
                        }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                        itemStyle={{ color: '#d1d5db' }}
                        cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px', color: '#9ca3af' }}
                        iconType="circle"
                        formatter={(value) => <span className="text-gray-600 dark:text-gray-300">{value}</span>}
                    />
                    <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                        animationBegin={200}
                    >
                        {data?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default BarChart;
