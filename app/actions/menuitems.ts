
"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";

export type MenuItemInput = {
  name: string;
  description: string;
  category: string;
  price: number;
  preparation_time: number | null;
  is_vegetarian: boolean;
  is_available: boolean;
};

export async function getMenuItems() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMenuForClient(){
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMenuItem(id: string) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(error.message);
  }

  return data;
}

export async function createMenuItem(formData: FormData) {
  const supabase = getSupabaseServerClient();

  // IMPORTANT:
  // Verify the signed-in user and their restaurant staff/admin
  // permissions here before continuing.

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));
  const preparationTimeValue = String(
    formData.get("preparation_time") ?? ""
  ).trim();

  const preparation_time =
    preparationTimeValue === "" ? null : Number(preparationTimeValue);

  const is_vegetarian = formData.get("is_vegetarian") === "on";
  const is_available = formData.get("is_available") === "on";

  const image = formData.get("image");

  if (!name || !category) {
    return { error: "Name and category are required." };
  }

  if (!Number.isFinite(price) || price < 0 || price > 99999999.99) {
    return { error: "Enter a valid price." };
  }

  if (
    preparation_time !== null &&
    (!Number.isInteger(preparation_time) || preparation_time < 0)
  ) {
    return { error: "Preparation time must be a non-negative integer." };
  }

  let image_url: string | null = null;
  let uploadedImagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(image.type)) {
      return { error: "Only JPEG, PNG, and WebP images are allowed." };
    }

    if (image.size > 5 * 1024 * 1024) {
      return { error: "Image size must be 5 MB or less." };
    }

    const extension = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    }[image.type];

    uploadedImagePath = `${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("menu_images")
      .upload(uploadedImagePath, image, {
        contentType: image.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("menu_images")
      .getPublicUrl(uploadedImagePath);

    image_url = publicUrlData.publicUrl;
  }

  const { error: insertError } = await supabase
    .from("menu_items")
    .insert({
      name,
      description: description || null,
      category,
      price,
      image_url,
      preparation_time,
      is_vegetarian,
      is_available,
    });

  if (insertError) {
    if (uploadedImagePath) {
      await supabase.storage
        .from("menu-images")
        .remove([uploadedImagePath]);
    }

    return { error: insertError.message };
  }

  revalidatePath("/admin/dashboard/menuitems");

  return { success: true };
}

export async function updateMenuItem(id: string, formData: FormData) {
  const supabase = getSupabaseServerClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));
  const preparationTimeValue = String(
    formData.get("preparation_time") ?? ""
  ).trim();
  const preparation_time =
    preparationTimeValue === "" ? null : Number(preparationTimeValue);
  const is_vegetarian = formData.get("is_vegetarian") === "on";
  const is_available = formData.get("is_available") === "on";

  if (!name || !category) {
    return { error: "Name and category are required." };
  }

  if (!Number.isFinite(price) || price < 0 || price > 99999999.99) {
    return { error: "Enter a valid price." };
  }

  if (
    preparation_time !== null &&
    (!Number.isInteger(preparation_time) || preparation_time < 0)
  ) {
    return { error: "Preparation time must be a non-negative integer." };
  }

  const image = formData.get("image");
  let image_url: string | undefined;
  let uploadedImagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(image.type)) {
      return { error: "Only JPEG, PNG, and WebP images are allowed." };
    }

    if (image.size > 5 * 1024 * 1024) {
      return { error: "Image size must be 5 MB or less." };
    }

    const extension = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    }[image.type];

    uploadedImagePath = `${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(uploadedImagePath, image, {
        contentType: image.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` };
    }

    image_url = supabase.storage
      .from("menu-images")
      .getPublicUrl(uploadedImagePath).data.publicUrl;
  }

  const update = {
    name,
    description: description || null,
    category,
    price,
    preparation_time,
    is_vegetarian,
    is_available,
    ...(image_url ? { image_url } : {}),
  };

  const { data, error } = await supabase
    .from("menu_items")
    .update(update)
    .eq("id", id)
    .select("image_url")
    .single();

  if (error) {
    if (uploadedImagePath) {
      await supabase.storage.from("menu-images").remove([uploadedImagePath]);
    }

    return { error: error.message };
  }

  revalidatePath("/admin/dashboard/menuitems");
  revalidatePath(`/admin/dashboard/${id}/edit`);

  return { success: true, imageUrl: data.image_url };
}
