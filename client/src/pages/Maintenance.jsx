import React from "react";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

const Maintenance = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <Wrench className="mx-auto w-16 h-16 text-yellow-400 mb-4" />

        <h1 className="text-3xl font-bold mb-3">
          Under Maintenance
        </h1>

        <p className="text-gray-300">
          EduTrack is currently undergoing scheduled maintenance.
          Please check back later.
        </p>
      </motion.div>
    </div>
  );
};

export default Maintenance;
