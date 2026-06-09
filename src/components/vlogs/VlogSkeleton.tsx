import React from "react";

export default function VlogSkeleton() {
  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden animate-pulse bg-white"
      style={{ border: "1.5px solid #E8D5BC" }}
    >
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-gray-200 rounded mt-2" />
        <div className="h-5 w-1/2 bg-gray-200 rounded" />
        <div className="space-y-2 mt-4 flex-1">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-4/5 bg-gray-200 rounded" />
        </div>
        <div className="pt-3 border-t mt-auto" style={{ borderColor: "#E8D5BC" }}>
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
