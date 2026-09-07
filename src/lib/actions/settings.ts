"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Introduz a palavra-passe atual."),
    newPassword: z
      .string()
      .min(8, "A nova palavra-passe deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As palavras-passe não coincidem.",
    path: ["confirmPassword"],
  });

export type SettingsState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

export async function changePassword(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const parsed = PasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
  });
  if (!admin) return { error: "Administrador não encontrado." };

  const valid = await verifyPassword(parsed.data.currentPassword, admin.password);
  if (!valid) {
    return { error: "A palavra-passe atual está incorreta." };
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { password: newHash },
  });

  return { success: "Palavra-passe atualizada com sucesso." };
}
