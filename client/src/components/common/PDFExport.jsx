import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const PDFExport = ({ data, filename = 'report', onExport }) => {
    const handleExport = () => {
        if (onExport) {
            onExport();
            return;
        }

        // This is a placeholder for PDF generation
        // In production, you would use a library like jsPDF or pdfmake
        console.log('PDF Export - Data:', data);
        console.log('PDF Export - Filename:', filename);

        // Example implementation would be:
        // import jsPDF from 'jspdf';
        // const doc = new jsPDF();
        // doc.text('Report', 10, 10);
        // doc.save(`${filename}.pdf`);

        alert('PDF export functionality - Would generate PDF with jsPDF library in production');
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
        >
            <FileText size={18} />
            Export PDF
        </motion.button>
    );
};

export default PDFExport;
