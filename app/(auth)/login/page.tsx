"use client"

import { useState } from "react"
import Link from "next/link"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowRight } from "lucide-react"

export default function LoginPage() {
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError("")
        const res = await login(formData)
        if (res?.error) {
            setError(res.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 pb-24">
            <Card className="w-full max-w-md shadow-lg border-none ring-1 ring-gray-200">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">С возвращением</CardTitle>
                    <CardDescription className="text-gray-500">Войдите в свой аккаунт, чтобы продолжить обучение</CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2 border border-red-200">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700" htmlFor="password">Пароль</label>
                            </div>
                            <Input id="password" name="password" type="password" required placeholder="••••••••" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full shadow flex items-center gap-2" size="lg" disabled={isLoading}>
                            {isLoading ? "Вход..." : "Войти"} <ArrowRight className="w-4 h-4" />
                        </Button>
                        <div className="w-full text-center text-sm text-gray-500">
                            Нет аккаунта?{" "}
                            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                Создать аккаунт
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
