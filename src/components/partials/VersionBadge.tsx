"use client";

import React, { useEffect, useState } from "react";

import pkg from "../../../package.json";

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
      .then((res) => {
        if (!res.ok) return null; // gracefully skip 404
        return res.json();
      })
      .then((data) => { if (data) setMetadata(data); })
      .catch(() => {});
  }, []);

  const version = metadata ? metadata.version : `v${pkg.version}`;
  const env = metadata ? metadata.environment : process.env.NODE_ENV;
  const commitText = metadata ? ` • ${metadata.commit.substring(0, 7)}` : "";

  if (env === "production") return null;

  return (
    <div className="fixed bottom-3 right-3 z-[9999] text-[10px] md:text-xs bg-[#2C1A0E]/90 text-[#FFFDF9] px-2.5 py-1 rounded-md border border-[#E8D5BC] shadow-md pointer-events-none select-none font-mono flex flex-col items-end gap-0.5">
      <div className="font-bold flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: env === "production" ? "#10B981" : "#F59E0B" }}></span>
        <span>{version}</span>
      </div>
      <div className="text-[8px] opacity-60 uppercase font-semibold tracking-wider">
        {env}{commitText}
      </div>
    </div>
  );
}
