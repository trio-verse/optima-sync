"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("organizationId");
  redirect("/register");
}

export default async function LogOutButton() {
  await logoutAction();
}