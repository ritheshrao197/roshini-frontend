"use client";

import React, { useEffect, useState } from "react";

interface BuildMetadata {
  version: string;
  environment: string;
  commit: string;
  build: number;
  branch: string;
  builtAt: string;
}

export default function VersionBadge() {
  const [metadata, setMetadata] = useState<BuildMetadata | null>(null);

  useEffect(() => {
    fetch("/build-metadata.json")
      .then((res) => res.json())
      .then((data) => setMetadata(data))
      .catch(() => {});
  }, []);

  if (!metadata) return null;

  return (
    <div className="fixed bottom-3 right-3 z-[9999] text-[10px] md:text-xs bg-[#2C1A0E]/90 text-[#FFFDF9] px-2.5 py-1 rounded-md border border-[#E8D5BC] shadow-md pointer-events-none select-none font-mono flex flex-col items-end gap-0.5">
      <div className="font-bold flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metadata.environment === "production" ? "#10B981" : "#F59E0B" }}></span>
        <span>{metadata.version}</span>
      </div>
      <div className="text-[8px] opacity-60 uppercase font-semibold tracking-wider">
        {metadata.environment} • {metadata.commit.substring(0, 7)}
      </div>
    </div>
  );
}
