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

      router.push("/admin/dashboard/menuitems");
      router.refresh();
    } catch {
      setError("Unable to create menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to menu items
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-3xl font-bold tracking-tight text-gray-900">
                Add menu item
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Create a new dish and add it to your restaurant menu.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Basic information
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Give your dish a name and describe what makes it special.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 px-6 py-6 sm:px-8">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Item name <span className="text-red-500">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  required
                  maxLength={200}
                  placeholder="e.g. Classic Chicken Burger"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Choose a clear, recognizable name for your dish.
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                  <span className="ml-2 font-normal text-gray-400">
                    Optional
                  </span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  maxLength={2000}
                  rows={4}
                  placeholder="Describe the ingredients, flavor, and what makes this dish unique..."
                  className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                />

                <p className="mt-2 text-xs text-gray-400">
                  A good description helps customers choose your dish.
                </p>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  required
                  defaultValue=""
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Starters">Starters</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
            </div>
          </section>

          {/* Pricing & Preparation */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Pricing & preparation
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Set the selling price and estimated cooking time.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2 sm:px-8">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Price <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-medium text-gray-500">
                    Rs.
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min="0"
                    max="99999999.99"
                    step="0.01"
                    placeholder="1,200.00"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-14 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Enter the price customers will pay.
                </p>
              </div>

              <div>
                <label
                  htmlFor="preparation_time"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Preparation time
                  <span className="ml-2 font-normal text-gray-400">
                    Optional
                  </span>
                </label>

                <div className="relative">
                  <input
                    id="preparation_time"
                    name="preparation_time"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="15"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />

                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-gray-400">
                    minutes
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Estimated time to prepare this dish.
                </p>
              </div>
            </div>
          </section>

          {/* Food Image */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Menu Image
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a photo to make your dish stand out on the menu.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 px-6 py-10 text-center transition hover:border-orange-300 hover:bg-orange-50/30"
              >
                <span className="text-sm font-semibold text-gray-800">
                  Click to upload a food image
                </span>

                <span className="mt-2 text-xs text-gray-500">
                  JPEG, PNG, or WebP · Maximum 5 MB
                </span>

                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                />
              </label>

              <p className="mt-3 text-xs leading-5 text-gray-400">
                For the best results, use a clear, well-lit image of the
                finished dish. Your server action should validate the file
                type and enforce the 5 MB size limit.
              </p>
            </div>
          </section>

          {/* Availability & Dietary Preferences */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5">
              <p className="font-semibold text-gray-900">
                Availability & dietary preferences
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Control whether customers can order this item.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-gray-300">
                <input
                  type="checkbox"
                  name="is_vegetarian"
                  className="mt-1 h-4 w-4 rounded border-gray-300 accent-orange-600 focus:ring-orange-500"
                />

                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-800">
                    Vegetarian
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    Mark this item as suitable for vegetarian customers.
                  </span>
                </div>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  Veg
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-gray-300">
                <input
                  type="checkbox"
                  name="is_available"
                  defaultChecked
                  className="mt-1 h-4 w-4 rounded border-gray-300 accent-orange-600 focus:ring-orange-500"
                />

                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-800">
                    Available for ordering
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    Customers can order this item when it is available.
                  </span>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Active
                </span>
              </label>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <svg
                className="mt-0.5 h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01"
                />
              </svg>

              <p>{error}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-2xl lg:border lg:px-6 lg:shadow-sm">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden text-xs text-gray-400 sm:block">
                <span className="text-red-500">*</span> Required fields
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => router.back()}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      Creating item...
                    </>
                  ) : (
                    <>
                     Create menu item
                    </>  
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
