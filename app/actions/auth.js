"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers"
export default async function LogOutButton(){
    const cookieStore=await cookies();
    cookieStore.delete("tokien");
    cookieStore.delete("organizationId");
    redirect("/register");
}