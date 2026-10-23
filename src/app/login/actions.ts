"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) redirect("/login?erro=1");
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  // Mesma resposta para e-mail inexistente e senha errada, para não revelar quais e-mails existem.
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) redirect("/login?erro=1");
  await setSessionCookie(user.id);
  redirect("/diagnosticos");
}
