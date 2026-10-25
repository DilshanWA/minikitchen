
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMenuItem } from "@/app/actions/menuitems";

export default function MenuItemForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    try {
      const result = await createMenuItem(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    } catch {
      setError("Unable to create menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Name *</label>
        <input
          name="name"
          required
          maxLength={200}
          className="w-full rounded-lg border p-2"
          placeholder="Chicken burger"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          name="description"
          maxLength={2000}
          rows={3}
          className="w-full rounded-lg border p-2"
          placeholder="Describe the menu item"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Category *
        </label>
        <select
          name="category"
          required
          defaultValue=""
          className="w-full rounded-lg border p-2"
        >
          <option value="" disabled>Select category</option>
          <option value="Starters">Starters</option>
          <option value="Main Course">Main Course</option>
          <option value="Burgers">Burgers</option>
          <option value="Pizza">Pizza</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Price *
          </label>
          <input
            name="price"
            type="number"
            required
            min="0"
            max="99999999.99"
            step="0.01"
            className="w-full rounded-lg border p-2"
            placeholder="1200.00"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Preparation time (minutes)
          </label>
          <input
            name="preparation_time"
            type="number"
            min="0"
            step="1"
            className="w-full rounded-lg border p-2"
            placeholder="15"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Food image
        </label>
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="w-full rounded-lg border p-2"
        />
        <p className="mt-1 text-xs text-gray-500">
          JPEG, PNG, or WebP. Maximum 5 MB.
        </p>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_vegetarian" />
          Vegetarian
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_available"
            defaultChecked
          />
          Available
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={loading}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create item"}
        </button>
      </div>
    </form>
  );
}
