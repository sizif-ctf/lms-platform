"use client"

import { useState } from "react"
import Link from "next/link"
import { register } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, GraduationCap, BookOpen, ArrowRight } from "lucide-react"

export default function RegisterPage() {
    const [error, setError] = useState<string>("")
    const [role, setRole] = useState<"student" | "teacher">("student")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError("")
        formData.append("role", role)
        const res = await register(formData)
        if (res?.error) {
            setError(res.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 pb-24">
            <Card className="w-full max-w-md shadow-lg border-none ring-1 ring-gray-200">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Создать аккаунт</CardTitle>
                    <CardDescription className="text-gray-500">Присоединяйтесь к платформе для обучения</CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2 border border-red-200">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-3 pb-2">
                            <label className="text-sm font-medium text-gray-700">Выберите роль</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("student")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === "student"
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-gray-200 bg-white hover:border-blue-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <GraduationCap className="w-8 h-8 mb-2" />
                                    <span className="font-semibold">Ученик</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("teacher")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === "teacher"
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-gray-200 bg-white hover:border-blue-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <BookOpen className="w-8 h-8 mb-2" />
                                    <span className="font-semibold">Учитель</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="full_name">Имя и фамилия</label>
                            <Input id="full_name" name="full_name" type="text" placeholder="Иван Иванов" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="password">Пароль</label>
                            <Input id="password" name="password" type="password" required placeholder="••••••••" minLength={6} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full shadow flex items-center gap-2" size="lg" disabled={isLoading}>
                            {isLoading ? "Регистрация..." : "Зарегистрироваться"} <ArrowRight className="w-4 h-4" />
                        </Button>
                        <div className="w-full text-center text-sm text-gray-500">
                            Уже есть аккаунт?{" "}
                            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                Войти
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
