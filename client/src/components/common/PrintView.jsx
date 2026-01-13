import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';

const PrintView = ({ children, title }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            {/* Print Button - Hidden in print */}
            <div className="no-print mb-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors shadow-md"
                >
                    <Printer size={18} />
                    Print
                </motion.button>
            </div>

            {/* Print Content */}
            <div className="print-content">
                {title && (
                    <div className="print-only mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                        <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                )}
                {children}
            </div>

            {/* Print Styles */}
            <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .print-content {
            background: white !important;
            color: black !important;
          }
          
          body {
            padding: 20px;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>
        </div>
    );
};

export default PrintView;
