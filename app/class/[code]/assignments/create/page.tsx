"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createAssignmentAction } from "@/app/actions/content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateAssignmentPage() {
    const { code } = useParams()
    const router = useRouter()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError("")

        const res = await createAssignmentAction(code as string, formData)
        if (res?.error) {
            setError(res.error)
            setIsLoading(false)
        } else {
            router.push(`/class/${code}/assignments`)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href={`/class/${code}/assignments`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Назад к заданиям
            </Link>

            <Card className="dark:bg-slate-950 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-2xl">Новое задание</CardTitle>
                    <CardDescription>Создайте задание с критериями оценивания</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        {error && <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-900/50">{error}</div>}

                        <div className="grid sm:grid-cols-[1fr_150px] gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="title">Название задания</label>
                                <Input id="title" name="title" placeholder="Эссе по истории" required className="dark:bg-slate-900 dark:border-slate-800" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="maxScore">Макс. балл</label>
                                <Input id="maxScore" name="maxScore" type="number" min="1" max="100" defaultValue="100" required className="dark:bg-slate-900 dark:border-slate-800" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="description">Условие и критерии оценки</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={8}
                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-50 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                placeholder="Подробно опишите, что нужно сделать и какие критерии будут использоваться при проверке."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-800">
                            <Link href={`/class/${code}/assignments`}>
                                <Button type="button" variant="ghost">Отмена</Button>
                            </Link>
                            <Button type="submit" disabled={isLoading} className="min-w-32">
                                {isLoading ? "Сохранение..." : "Опубликовать"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
