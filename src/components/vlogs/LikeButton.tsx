"use client";

import React, { useState, useEffect } from "react";

interface LikeButtonProps {
  vlogId: string;
  initialLikes: number;
}

export default function LikeButton({ vlogId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has already liked this vlog in the current browser session
    const likedVlogs = JSON.parse(localStorage.getItem("liked_vlogs") || "[]");
    if (likedVlogs.includes(vlogId)) {
      setLiked(true);
    }
  }, [vlogId]);

  const handleLike = async () => {
    if (liked || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/vlogs/${vlogId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likesCount);
        setLiked(true);

        const likedVlogs = JSON.parse(localStorage.getItem("liked_vlogs") || "[]");
        likedVlogs.push(vlogId);
        localStorage.setItem("liked_vlogs", JSON.stringify(likedVlogs));
      }
    } catch (err) {
      console.error("Error liking vlog:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all shadow-sm ${
        liked
          ? "bg-red-50 text-red-600 border-red-200"
          : "bg-white hover:bg-red-50/40 text-gray-700 hover:text-red-600 border-[#E8D5BC] hover:border-red-200"
      }`}
    >
      <span className="text-base">{liked ? "❤️" : "🤍"}</span>
      <span>{likes} {likes === 1 ? "Like" : "Likes"}</span>
    </button>
  );
}
