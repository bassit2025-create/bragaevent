"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const BannerSchema = z
  .object({
    name: z.string().min(3, "O nome do banner deve ter pelo menos 3 caracteres."),
    projectName: z.string().min(2, "Indica o nome do projeto/negócio."),
    image: z.string().url("Indica um URL de imagem válido."),
    destinationUrl: z.string().url("Indica um URL de destino válido."),
    description: z.string().optional(),
    startDate: z.string().min(1, "A data de início é obrigatória."),
    endDate: z.string().min(1, "A data de fim é obrigatória."),
    publish: z.coerce.boolean(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "A data de fim deve ser depois da data de início.",
    path: ["endDate"],
  });

export type BannerFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

function parseBannerForm(formData: FormData) {
  return BannerSchema.safeParse({
    name: formData.get("name"),
    projectName: formData.get("projectName"),
    image: formData.get("image"),
    destinationUrl: formData.get("destinationUrl"),
    description: formData.get("description") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    publish: formData.get("publish") === "on",
  });
}

/** Derives the correct status from the schedule + the admin's publish intent. */
function deriveStatus(startDate: Date, endDate: Date, publish: boolean) {
  if (!publish) return "DISABLED" as const;
  const now = new Date();
  if (now < startDate) return "SCHEDULED" as const;
  if (now > endDate) return "EXPIRED" as const;
  return "ACTIVE" as const;
}

export async function createBanner(
  _prevState: BannerFormState,
  formData: FormData
): Promise<BannerFormState> {
  await requireAdmin();

  const parsed = parseBannerForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  await prisma.banner.create({
    data: {
      name: data.name,
      projectName: data.projectName,
      image: data.image,
      destinationUrl: data.destinationUrl,
      description: data.description || null,
      startDate,
      endDate,
      status: deriveStatus(startDate, endDate, data.publish),
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function updateBanner(
  bannerId: string,
  _prevState: BannerFormState,
  formData: FormData
): Promise<BannerFormState> {
  await requireAdmin();

  const parsed = parseBannerForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  const existing = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!existing) return { error: "Banner não encontrado." };

  await prisma.banner.update({
    where: { id: bannerId },
    data: {
      name: data.name,
      projectName: data.projectName,
      image: data.image,
      destinationUrl: data.destinationUrl,
      description: data.description || null,
      startDate,
      endDate,
      status: deriveStatus(startDate, endDate, data.publish),
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(bannerId: string) {
  await requireAdmin();
  await prisma.banner.delete({ where: { id: bannerId } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBannerPublished(bannerId: string) {
  await requireAdmin();
  const banner = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!banner) return;

  const publish = banner.status === "DISABLED";
  await prisma.banner.update({
    where: { id: bannerId },
    data: {
      status: deriveStatus(banner.startDate, banner.endDate, publish),
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
}
