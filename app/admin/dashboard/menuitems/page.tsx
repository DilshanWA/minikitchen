import { getMenuItems } from "@/app/actions/menuitems";
import Link from "next/link";
import { Pencil } from "lucide-react";

export default async function MenuItemsPage() {
  const menuItems = await getMenuItems();
  console.log("menuItems", menuItems);

  return (
    <main className="mx-auto max-w-7xl">
       <div className="flex items-center justify-end border-b border-gray-200 py-4 ">
         <Link className="bg-black font-bold text-white p-3 rounded-md "
          href="/admin/dashboard/newmenu"
         >
           Create New Item
         </Link>
       </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <p className="font-semibold text-gray-900">
            Current menu ({menuItems.length})
          </p>
        </div>

        {menuItems.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">
            No menu items found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Discription</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Prep time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt=""
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-100" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.description || "No description"}</td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.preparation_time
                        ? `${item.preparation_time} min`
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.is_available
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/dashboard/${item.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
