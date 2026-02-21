"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createProfile, getProfile } from "@/lib/db"
import { setSession, clearSession } from "@/lib/session"
import { Role } from "@/types"

import { prisma } from "@/lib/prisma"

export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string // In a real app we'd verify this

    const user = await prisma.profile.findUnique({
        where: { email }
    })

    if (!user) {
        return { error: "Неверный email или пароль. (Демо: зарегистрируйтесь сначала)" }
    }

    await setSession(user.id)
    redirect("/dashboard")
}

export async function register(formData: FormData) {
    const email = formData.get("email") as string
    const fullName = formData.get("full_name") as string
    const role = formData.get("role") as Role
    const password = formData.get("password") as string

    const existingUser = await prisma.profile.findUnique({
        where: { email }
    })

    if (existingUser) {
        return { error: "Пользователь с таким email уже существует" }
    }

    const newProfile = await createProfile({
        email,
        full_name: fullName,
        role
    })

    await setSession(newProfile.id)
    redirect("/dashboard")
}

export async function logout() {
    await clearSession()
    redirect("/")
}
