"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL, Vlog } from "@/lib/api";

export default function AdminVlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchVlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/admin/vlogs`, {
        headers: {
          token: localStorage.getItem("token") || ""
        },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setVlogs(data.vlogs || []);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to load blogs");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void fetchVlogs();
    });
  }, []);

  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    try {
      setActionId(id);
      setError("");
      const action = currentStatus ? "unpublish" : "publish";
      const res = await fetch(`${API_URL}/admin/vlogs/${id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || ""
        },
        credentials: "include",
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        await fetchVlogs();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update publish state");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update publish state");
    } finally {
      setActionId(null);
    }
  };

  const handleStatusChange = async (id: string, status: "Draft" | "Archived") => {
    try {
      setActionId(id);
      setError("");
      const res = await fetch(`${API_URL}/admin/vlogs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || ""
        },
        credentials: "include",
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        await fetchVlogs();
      } else {
        const data = await res.json();
        setError(data.error || `Failed to set status to ${status}`);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to set status to ${status}`);
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteVlog = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the blog "${title}"?`)) {
      return;
    }

    try {
      setActionId(id);
      setError("");
      const res = await fetch(`${API_URL}/admin/vlogs/${id}`, {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("token") || ""
        },
        credentials: "include"
      });
      if (res.ok) {
        await fetchVlogs();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting the blog");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Vlogs</h1>
        <Link 
          href="/admin/vlogs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create New Vlog
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : vlogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No vlogs found.</td>
              </tr>
            ) : (
              vlogs.map((vlog) => (
                <tr key={vlog._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vlog.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vlog.vCategory?.cName || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vlog.status === "Archived"
                        ? "bg-gray-200 text-gray-700"
                        : vlog.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {vlog.status || (vlog.isPublished ? "Published" : "Draft")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vlog.viewCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button 
                      disabled={actionId === vlog._id || vlog.status === "Archived"}
                      onClick={() => handlePublishToggle(vlog._id, vlog.isPublished)}
                      className="text-indigo-600 hover:text-indigo-900 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {vlog.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      disabled={actionId === vlog._id}
                      onClick={() => handleStatusChange(vlog._id, vlog.status === "Archived" ? "Draft" : "Archived")}
                      className="text-amber-600 hover:text-amber-900 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {vlog.status === "Archived" ? "Restore" : "Archive"}
                    </button>
                    <Link href={`/admin/vlogs/${vlog._id}/edit`} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </Link>
                    <button 
                      disabled={actionId === vlog._id}
                      onClick={() => handleDeleteVlog(vlog._id, vlog.title)}
                      className="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {actionId === vlog._id ? "Working..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
