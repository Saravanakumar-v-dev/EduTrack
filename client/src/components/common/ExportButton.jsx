import { Download, FileText, Table } from 'lucide-react';
import { motion } from 'framer-motion';

const ExportButton = ({ data, filename = 'report', type = 'csv', label, icon: Icon, onExport }) => {
    const handleExport = () => {
        if (onExport) {
            onExport();
            return;
        }

        if (type === 'csv') {
            exportToCSV(data, filename);
        } else if (type === 'json') {
            exportToJSON(data, filename);
        } else if (type === 'pdf') {
            // PDF export would require a library like jsPDF
            console.log('PDF export - requires jsPDF library');
        }
    };

    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) {
            console.error('No data to export');
            return;
        }

        // Get headers from first object
        const headers = Object.keys(data[0]);
        const csvRows = [];

        // Add header row
        csvRows.push(headers.join(','));

        // Add data rows
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                // Escape commas and quotes
                const escaped = ('' + value).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        // Create blob and download
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const exportToJSON = (data, filename) => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const iconMap = {
        csv: Table,
        json: FileText,
        pdf: FileText,
    };

    const IconComponent = Icon || iconMap[type] || Download;

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
        >
            <IconComponent size={18} />
            {label || `Export ${type.toUpperCase()}`}
        </motion.button>
    );
};

export default ExportButton;
