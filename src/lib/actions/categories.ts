"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { slugify } from "@/lib/utils";

const CategorySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  icon: z.string().min(1, "Escolhe um emoji/ícone."),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Indica uma cor hexadecimal válida (#RRGGBB)."),
});

export type CategoryFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const parsed = CategorySchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const slug = slugify(parsed.data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return { error: "Já existe uma categoria com este nome." };
  }

  await prisma.category.create({
    data: { ...parsed.data, slug },
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/");
}

export async function updateCategory(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const parsed = CategorySchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const slug = slugify(parsed.data.name);
  const conflict = await prisma.category.findFirst({
    where: { slug, NOT: { id: categoryId } },
  });
  if (conflict) {
    return { error: "Já existe outra categoria com este nome." };
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: { ...parsed.data, slug },
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/");
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();

  const eventCount = await prisma.event.count({ where: { categoryId } });
  if (eventCount > 0) {
    throw new Error(
      "Não é possível eliminar uma categoria com eventos associados."
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/");
}
