"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createLectureAction } from "@/app/actions/content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateLecturePage() {
    const { code } = useParams()
    const router = useRouter()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError("")

        const res = await createLectureAction(code as string, formData)
        if (res?.error) {
            setError(res.error)
            setIsLoading(false)
        } else {
            router.push(`/class/${code}`)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href={`/class/${code}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Назад к лекциями
            </Link>

            <Card className="dark:bg-slate-950 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-2xl">Новая лекция</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        {error && <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-900/50">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="title">Тема лекции</label>
                            <Input id="title" name="title" placeholder="Например: Введение в JavaScript" required className="text-lg py-6 dark:bg-slate-900 dark:border-slate-800" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="content">Содержание лекции (текст, ссылки)</label>
                            <textarea
                                id="content"
                                name="content"
                                rows={12}
                                required
                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-50 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                placeholder="Опишите материал лекции. Можно вставлять ссылки и текст."
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href={`/class/${code}`}>
                                <Button type="button" variant="outline">Отмена</Button>
                            </Link>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Сохранение..." : "Опубликовать лекцию"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
