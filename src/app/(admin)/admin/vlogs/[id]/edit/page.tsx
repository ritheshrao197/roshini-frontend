"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { VlogCategory, getVlogCategories } from "@/lib/api";
import VlogForm from "@/components/admin/vlogs/VlogForm";

export default function EditVlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [categories, setCategories] = useState<VlogCategory[]>([]);
  const [vlog, setVlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVlogCategories().then(setCategories);
    fetchVlog();
  }, []);

  const fetchVlog = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}/api/admin/vlogs`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
      });
      if (res.ok) {
        const data = await res.json();
        const found = data.vlogs.find((v: any) => v._id === id);
        if (found) {
          setVlog(found);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading vlog data...</div>;
  if (!vlog) return <div className="p-6 text-red-500">Vlog not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <VlogForm 
        initialVlog={vlog}
        categoriesList={categories}
        onSuccess={() => router.push("/admin/vlogs")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
