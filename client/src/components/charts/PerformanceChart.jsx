import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

const PerformanceChart = ({ data, type = 'line', title = "Performance Trend", color = '#4f46e5' }) => {
    const ChartComponent = type === 'area' ? AreaChart : LineChart;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>

            <ResponsiveContainer width="100%" height={300}>
                <ChartComponent data={data || []}>
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                    <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        className="dark:fill-gray-400"
                    />
                    <YAxis
                        stroke="#9ca3af"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        className="dark:fill-gray-400"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--tooltip-bg, #fff)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            color: '#374151'
                        }}
                        labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                    />
                    {type === 'area' ? (
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            fill="url(#colorGradient)"
                            animationDuration={1500}
                            animationBegin={0}
                        />
                    ) : (
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            dot={{ fill: color, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                            animationBegin={0}
                        />
                    )}
                </ChartComponent>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default PerformanceChart;
