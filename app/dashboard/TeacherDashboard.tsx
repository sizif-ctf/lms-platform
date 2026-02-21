"use client"

import { useState } from "react"
import Link from "next/link"
import { createClassAction } from "@/app/actions/classes"
import { ClassEntity } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Copy, CheckCircle2 } from "lucide-react"

export default function TeacherDashboard({ classes }: { classes: ClassEntity[] }) {
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState("")
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    async function handleCreate(formData: FormData) {
        setIsCreating(true)
        setError("")
        const res = await createClassAction(formData)
        if (res?.error) {
            setError(res.error)
        }
        setIsCreating(false)
    }

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    return (
        <div className="space-y-8">
            <Card className="bg-white border-blue-100 shadow-sm dark:bg-slate-950 dark:border-blue-900/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                        Создать новый класс
                    </CardTitle>
                    <CardDescription>Заполните данные для создания учебной группы</CardDescription>
                </CardHeader>
                <form action={handleCreate}>
                    <CardContent className="space-y-4">
                        {error && <div className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</div>}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="name">Название класса</label>
                                <Input id="name" name="name" placeholder="Например: Математика 10А" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="description">Описание (необязательно)</label>
                                <Input id="description" name="description" placeholder="Краткое описание курса" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? "Создание..." : "Создать класс"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-950/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-800">
                        У вас пока нет созданных классов
                    </div>
                ) : (
                    classes.map((cls) => (
                        <Card key={cls.id} className="hover:shadow-md transition-shadow flex flex-col">
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{cls.name}</CardTitle>
                                <CardDescription className="line-clamp-2 min-h-10">{cls.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg flex items-center justify-between border border-gray-100 dark:border-slate-800">
                                    <div className="text-xs text-gray-500 dark:text-slate-400">Код класса:</div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-blue-600 tracking-wider text-lg">{cls.code}</span>
                                        <button
                                            onClick={() => copyCode(cls.code)}
                                            className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
                                            title="Копировать код"
                                        >
                                            {copiedCode === cls.code ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Link href={`/class/${cls.code}`} className="w-full">
                                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                        Перейти в класс <Users className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
