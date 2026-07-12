"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VlogCategory, getVlogCategories } from "@/lib/api";
import VlogForm from "@/components/admin/vlogs/VlogForm";

export default function CreateVlogPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<VlogCategory[]>([]);

  useEffect(() => {
    getVlogCategories().then(setCategories);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <VlogForm 
        categoriesList={categories}
        onSuccess={() => router.push("/admin/vlogs")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
