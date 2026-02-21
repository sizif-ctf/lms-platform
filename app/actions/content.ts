"use server"

import { revalidatePath } from "next/cache"
import { createLecture, getClassByCode, createAssignment, submitAssignment, gradeSubmission, createMaterial } from "@/lib/db"
import { getSessionProfile } from "@/lib/session"

export async function createLectureAction(classCode: string, formData: FormData) {
    const profile = await getSessionProfile()
    if (!profile || profile.role !== "teacher") return { error: "Нет доступа" }

    const classData = await getClassByCode(classCode)
    if (!classData || classData.teacher_id !== profile.id) return { error: "Класс не найден или нет доступа" }

    const title = formData.get("title") as string
    const content = formData.get("content") as string

    if (!title || !content) return { error: "Заполните все поля" }

    await createLecture(classData.id, title, content)
    revalidatePath(`/class/${classCode}`)
    revalidatePath(`/class/${classCode}/lectures`)
    return { success: true }
}

export async function createAssignmentAction(classCode: string, formData: FormData) {
    const profile = await getSessionProfile()
    if (!profile || profile.role !== "teacher") return { error: "Нет доступа" }

    const classData = await getClassByCode(classCode)
    if (!classData || classData.teacher_id !== profile.id) return { error: "Класс не найден или нет доступа" }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const maxScore = Number(formData.get("maxScore"))

    if (!title || !description || isNaN(maxScore) || maxScore <= 0) {
        return { error: "Проверьте введенные данные" }
    }

    await createAssignment(classData.id, title, description, maxScore)
    revalidatePath(`/class/${classCode}/assignments`)
    return { success: true }
}

export async function submitAssignmentAction(assignmentId: string, classCode: string, formData: FormData) {
    const profile = await getSessionProfile()
    if (!profile || profile.role !== "student") return { error: "Только ученики могут отправлять решения" }

    const content = formData.get("content") as string
    const fileUrl = formData.get("fileUrl") as string | null

    await submitAssignment(assignmentId, profile.id, content, fileUrl)
    revalidatePath(`/class/${classCode}/assignments`)
    revalidatePath(`/class/${classCode}/assignments/${assignmentId}`)
    return { success: true }
}

export async function gradeSubmissionAction(submissionId: string, classCode: string, assignmentId: string, formData: FormData) {
    const profile = await getSessionProfile()
    if (!profile || profile.role !== "teacher") return { error: "Нет доступа" }

    const score = Number(formData.get("score"))
    const comment = formData.get("comment") as string

    if (isNaN(score)) return { error: "Некорректная оценка" }

    await gradeSubmission(submissionId, score, comment)
    revalidatePath(`/class/${classCode}/assignments/${assignmentId}`)
    return { success: true }
}

export async function createMaterialAction(classCode: string, formData: FormData) {
    const profile = await getSessionProfile()
    if (!profile || profile.role !== "teacher") return { error: "Нет доступа" }

    const classData = await getClassByCode(classCode)
    if (!classData || classData.teacher_id !== profile.id) return { error: "Класс не найден или нет доступа" }

    const title = formData.get("title") as string
    const fileUrl = formData.get("fileUrl") as string

    if (!title || !fileUrl) return { error: "Заполните все поля" }

    await createMaterial(classData.id, title, fileUrl)
    revalidatePath(`/class/${classCode}/materials`)
    return { success: true }
}
