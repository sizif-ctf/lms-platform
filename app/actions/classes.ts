"use server"

import { revalidatePath } from "next/cache"
import { createClass, joinClass, getClassByCode } from "@/lib/db"
import { getSessionProfile } from "@/lib/session"

export async function createClassAction(formData: FormData) {
    const profile = await getSessionProfile()
    if (!profile || profile.role !== "teacher") {
        return { error: "Нет доступа" }
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name || name.trim() === "") {
        return { error: "Название класса обязательно" }
    }

    const newClass = await createClass(profile.id, name, description)
    revalidatePath("/dashboard")
    return { success: true, classCode: newClass.code }
}

export async function joinClassAction(formData: FormData) {
    const profile = await getSessionProfile()
    if (!profile || profile.role !== "student") {
        return { error: "Только ученики могут присоединяться к классам" }
    }

    const code = formData.get("code") as string
    if (!code || code.trim() === "") {
        return { error: "Введите код класса" }
    }

    const classRef = await getClassByCode(code.toUpperCase())
    if (!classRef) {
        return { error: "Класс с таким кодом не найден" }
    }

    await joinClass(classRef.id, profile.id)
    revalidatePath("/dashboard")
    return { success: true, classId: classRef.id }
}
