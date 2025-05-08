"use client";

import { useRouter } from "next/navigation";

export default function StoreAddress() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={() => router.push("/store")}
        className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg shadow hover:bg-blue-700 transition"
      >
        Add Item
      </button>
    </div>
  );
}
