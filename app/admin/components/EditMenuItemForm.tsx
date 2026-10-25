"use client";

import { updateMenuItem } from "@/app/actions/menuitems";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number | string;
  preparation_time: number | null;
  image_url: string | null;
  is_vegetarian: boolean;
  is_available: boolean;
};

export default function EditMenuItemForm({ item }: { item: MenuItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    try {
      const result = await updateMenuItem(item.id, formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/admin/dashboard/menuitems");
      router.refresh();
    } catch {
      setError("Unable to update menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Back to menu items
        </button>
        <p className="text-3xl font-bold text-gray-900">Edit menu item</p>
        <p className="mt-2 text-sm text-gray-500">
          Update the details shown to your customers.
        </p>
      </div>

      <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Item name *
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={200}
            defaultValue={item.name}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={2000}
            rows={4}
            defaultValue={item.description ?? ""}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={item.category}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          >
            <option value="Starters">Starters</option>
            <option value="Main Course">Main Course</option>
            <option value="Burgers">Burgers</option>
            <option value="Pizza">Pizza</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-2 block text-sm font-medium">
              Price *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              min="0"
              max="99999999.99"
              step="0.01"
              defaultValue={item.price}
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />
          </div>
          <div>
            <label
              htmlFor="preparation_time"
              className="mb-2 block text-sm font-medium"
            >
              Preparation time (minutes)
            </label>
            <input
              id="preparation_time"
              name="preparation_time"
              type="number"
              min="0"
              step="1"
              defaultValue={item.preparation_time ?? ""}
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Replace image
          </label>
          {item.image_url && (
            <img
              src={item.image_url}
              alt={`Current image for ${item.name}`}
              className="mb-3 h-24 w-24 rounded-lg object-cover"
            />
          )}
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full rounded-xl border border-gray-200 p-3"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to keep the current image. JPEG, PNG, or WebP up to 5 MB.
          </p>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_vegetarian"
              defaultChecked={item.is_vegetarian}
            />
            Vegetarian
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_available"
              defaultChecked={item.is_available}
            />
            Available
          </label>
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => router.back()}
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
