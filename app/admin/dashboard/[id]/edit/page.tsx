import { getMenuItem } from "@/app/actions/menuitems";
import EditMenuItemForm from "@/app/admin/components/EditMenuItemForm";
import { notFound } from "next/navigation";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getMenuItem(id);

  if (!item) {
    notFound();
  }

  return <EditMenuItemForm item={item} />;
}