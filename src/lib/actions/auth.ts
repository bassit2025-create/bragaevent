"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";

const LoginSchema = z.object({
  email: z.string().email({ message: "Introduz um email válido." }),
  password: z.string().min(1, { message: "A palavra-passe é obrigatória." }),
});

export type LoginState = {
  error?: string;
} | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Verifica o email e a palavra-passe introduzidos." };
  }

  const { email, password } = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { email } });

  // Always run bcrypt.compare even when the admin doesn't exist, using a
  // stable dummy hash, to avoid leaking account existence through timing.
  const passwordHash =
    admin?.password ??
    "$2b$12$KIXQ0Q0Q0Q0Q0Q0Q0Q0Q0OQ0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0";
  const valid = await verifyPassword(password, passwordHash);

  if (!admin || !valid) {
    return { error: "Email ou palavra-passe incorretos." };
  }

  await createSession({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
