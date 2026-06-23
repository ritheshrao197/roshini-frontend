"use client";

import React, { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

interface EmailLog {
  _id: string;
  to: string;
  subject: string;
  status: "Sent" | "Failed" | "Pending";
  errorDetails?: string;
  createdAt: string;
}

export default function EmailLogsPanel() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API_URL}/admin/email-logs`, {
        headers: { token },
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        setLogs(json.logs || []);
      } else {
        setError(json.error || "Failed to load email logs.");
      }
    } catch (err) {
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-sm text-[#7A5C45]">Loading email logs...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">Email Logs</h2>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-[#6B3E26] text-[#F5E9DA] text-xs font-semibold rounded-full hover:bg-[#4e2c18] transition-all"
        >
          Refresh Logs
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-[#FFFDF9]" style={{ borderColor: "#E8D5BC" }}>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b last:border-0 hover:bg-[#F5E9DA]/40 transition-colors" style={{ borderColor: "#E8D5BC" }}>
                <td className="px-4 py-3 text-[#6B3E26]">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium text-[#6B3E26]">{log.to}</td>
                <td className="px-4 py-3 text-[#7A5C45]">{log.subject}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-block px-2 py-1 rounded text-[10px] font-bold ${
                      log.status === "Sent"
                        ? "bg-green-100 text-green-700"
                        : log.status === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {log.status.toUpperCase()}
                  </span>
                  {log.errorDetails && (
                    <p className="text-[10px] text-red-500 mt-1" title={log.errorDetails}>
                      View Error
                    </p>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-[#7A5C45]">No email logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
