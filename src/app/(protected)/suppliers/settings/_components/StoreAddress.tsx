"use client";

import { useRouter } from "next/router";

import { useEffect, useState } from "react";

export default function StoreAddress() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("shoppingList") || "[]");
    setItems(savedItems);
  }, []);

  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping List</h1>
      <p className="text-gray-600 mb-6">List of items you plan to purchase.</p>
      <button
        onClick={() => router.push("/add-item")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Item
      </button>

      <div className="mt-6 space-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="border rounded p-4 flex items-center justify-between bg-white"
          >
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p>{item.description}</p>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 border px-3 py-1 rounded">
                Buy Now
              </button>
              <button
                className="text-red-600 border px-3 py-1 rounded"
                onClick={() => {
                  const updated = items.filter((_, i) => i !== idx);
                  localStorage.setItem("shoppingList", JSON.stringify(updated));
                  setItems(updated);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
