"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers"
export default async function LogOutButton(){
    const cookieStore=await cookies();
    cookieStore.delete("token");
    cookieStore.delete("organizationId");
    redirect("/register");
}