// client/src/components/ChartCard.jsx
import React from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export default function ChartCard({ title = "Performance", data = [], dataKey = "percentage", color = "#6366F1" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white glass p-4 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-gray-400">Last 6 tests</p>
        </div>
        <div className="text-sm font-bold text-indigo-600">Avg {data.length ? `${Math.round(data.reduce((s,d)=>s+Number(d[dataKey]),0)/data.length)}%` : "--"}</div>
      </div>

      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
