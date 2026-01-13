import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";

const AIInsights = () => {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    axios.get("/api/ai/insights").then((res) => {
      setInsights(res.data.insights || []);
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>

          <div className="bg-white p-6 rounded shadow space-y-3">
            {insights.length === 0 ? (
              <p>No insights available.</p>
            ) : (
              insights.map((i, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-indigo-50 rounded border"
                >
                  {i}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AIInsights;
