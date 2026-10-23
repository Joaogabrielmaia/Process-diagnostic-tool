"use server";

import { redirect } from "next/navigation";
import { submitClientProcess } from "@/lib/services/diagnoses";
import { clientFormSchema } from "@/lib/validation";

export async function submitClientAction(token: string, formData: FormData) {
  const parsed = clientFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/cliente/${token}?erro=1`);
  const result = await submitClientProcess(token, parsed.data);
  if (!result.ok) redirect(`/cliente/${token}`);
  redirect(`/cliente/${token}?ok=1`);
}
