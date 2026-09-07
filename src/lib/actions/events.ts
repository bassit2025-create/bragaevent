"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { slugify } from "@/lib/utils";

const EventSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  image: z.string().url("Indica um URL de imagem válido."),
  date: z.string().min(1, "A data é obrigatória."),
  startTime: z.string().min(1, "A hora de início é obrigatória."),
  endTime: z.string().optional(),
  location: z.string().min(1, "O local é obrigatório."),
  address: z.string().min(1, "O endereço é obrigatório."),
  categoryId: z.string().min(1, "Escolhe uma categoria."),
  price: z.coerce.number().min(0, "O preço não pode ser negativo."),
  isFree: z.coerce.boolean(),
  description: z.string().min(10, "Escreve uma descrição mais completa."),
  organizer: z.string().min(1, "O organizador é obrigatório."),
  website: z.string().optional(),
  instagram: z.string().optional(),
  isFeatured: z.coerce.boolean(),
  published: z.coerce.boolean(),
});

export type EventFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

function parseEventForm(formData: FormData) {
  return EventSchema.safeParse({
    title: formData.get("title"),
    image: formData.get("image"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime") || undefined,
    location: formData.get("location"),
    address: formData.get("address"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price") || 0,
    isFree: formData.get("isFree") === "on",
    description: formData.get("description"),
    organizer: formData.get("organizer"),
    website: formData.get("website") || undefined,
    instagram: formData.get("instagram") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    published: formData.get("published") === "on",
  });
}

export async function createEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireAdmin();

  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const event = await prisma.event.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      image: data.image,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime || null,
      location: data.location,
      address: data.address,
      price: data.isFree ? 0 : data.price,
      isFree: data.isFree,
      organizer: data.organizer,
      website: data.website || null,
      instagram: data.instagram || null,
      isFeatured: data.isFeatured,
      status: data.published ? "PUBLISHED" : "DRAFT",
      categoryId: data.categoryId,
    },
  });

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  revalidatePath("/");
  redirect(`/admin/eventos/${event.id}`);
}

export async function updateEvent(
  eventId: string,
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireAdmin();

  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const existing = await prisma.event.findUnique({ where: { id: eventId } });
  if (!existing) {
    return { error: "Evento não encontrado." };
  }

  let slug = existing.slug;
  if (slugify(data.title) !== existing.slug) {
    const baseSlug = slugify(data.title);
    slug = baseSlug;
    let suffix = 1;
    while (
      await prisma.event.findFirst({ where: { slug, NOT: { id: eventId } } })
    ) {
      slug = `${baseSlug}-${suffix++}`;
    }
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title: data.title,
      slug,
      description: data.description,
      image: data.image,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime || null,
      location: data.location,
      address: data.address,
      price: data.isFree ? 0 : data.price,
      isFree: data.isFree,
      organizer: data.organizer,
      website: data.website || null,
      instagram: data.instagram || null,
      isFeatured: data.isFeatured,
      status: data.published ? "PUBLISHED" : "DRAFT",
      categoryId: data.categoryId,
    },
  });

  revalidatePath("/admin/eventos");
  revalidatePath(`/admin/eventos/${eventId}`);
  revalidatePath("/eventos");
  revalidatePath(`/eventos/${existing.slug}`);
  revalidatePath(`/eventos/${slug}`);
  revalidatePath("/");
  redirect(`/admin/eventos/${eventId}`);
}

export async function deleteEvent(eventId: string) {
  await requireAdmin();
  const event = await prisma.event.delete({ where: { id: eventId } });
  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  revalidatePath(`/eventos/${event.slug}`);
  revalidatePath("/");
}

export async function toggleEventPublished(eventId: string) {
  await requireAdmin();
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return;

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: { status: event.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  });

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  revalidatePath(`/eventos/${updated.slug}`);
  revalidatePath("/");
}

export async function toggleEventFeatured(eventId: string) {
  await requireAdmin();
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return;

  await prisma.event.update({
    where: { id: eventId },
    data: { isFeatured: !event.isFeatured },
  });

  revalidatePath("/admin/eventos");
  revalidatePath("/");
}
