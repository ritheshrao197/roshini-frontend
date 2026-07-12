"use client";

import React, { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blogs/${slug}`;
    }
    return "";
  };

  const copyToClipboard = () => {
    const url = getShareUrl();
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(getShareUrl());
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-bold uppercase text-[#7A5C45] mr-2">Share Article:</span>
      
      {/* WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="h-8 w-8 rounded-full border border-[#E8D5BC] bg-white flex items-center justify-center text-sm hover:bg-[#25D366]/10 hover:border-[#25D366] text-gray-600 hover:text-[#25D366] transition-all"
        title="Share on WhatsApp"
      >
        💬
      </a>

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="h-8 w-8 rounded-full border border-[#E8D5BC] bg-white flex items-center justify-center text-sm hover:bg-[#1877F2]/10 hover:border-[#1877F2] text-gray-600 hover:text-[#1877F2] transition-all"
        title="Share on Facebook"
      >
        👥
      </a>

      {/* X / Twitter */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="h-8 w-8 rounded-full border border-[#E8D5BC] bg-white flex items-center justify-center text-sm hover:bg-black/10 hover:border-black text-gray-600 hover:text-black transition-all"
        title="Share on X (Twitter)"
      >
        🐦
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="h-8 w-8 rounded-full border border-[#E8D5BC] bg-white flex items-center justify-center text-sm hover:bg-[#0077B5]/10 hover:border-[#0077B5] text-gray-600 hover:text-[#0077B5] transition-all"
        title="Share on LinkedIn"
      >
        🔗
      </a>

      {/* Copy Link Button */}
      <button
        onClick={copyToClipboard}
        className="relative h-8 px-3 rounded-full border border-[#E8D5BC] bg-white flex items-center justify-center text-[10px] font-bold uppercase text-gray-600 hover:bg-[#6B3E26]/5 hover:border-[#6B3E26] hover:text-[#6B3E26] transition-all"
        title="Copy Link to Clipboard"
      >
        {copied ? "Copied! ✓" : "Copy Link"}
      </button>
    </div>
  );
}
