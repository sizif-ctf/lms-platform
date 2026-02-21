"use client"

import { useState } from "react"
import Link from "next/link"
import { joinClassAction } from "@/app/actions/classes"
import { ClassEntity } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, ArrowRight } from "lucide-react"

export default function StudentDashboard({ classes }: { classes: ClassEntity[] }) {
    const [isJoining, setIsJoining] = useState(false)
    const [error, setError] = useState("")

    async function handleJoin(formData: FormData) {
        setIsJoining(true)
        setError("")
        const res = await joinClassAction(formData)
        if (res?.error) {
            setError(res.error)
        }
        setIsJoining(false)
    }

    return (
        <div className="space-y-8">
            <Card className="bg-white border-blue-100 shadow-sm max-w-xl dark:bg-slate-950 dark:border-blue-900/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                        Присоединиться к классу
                    </CardTitle>
                    <CardDescription>Введите 6-значный код, выданный учителем</CardDescription>
                </CardHeader>
                <form action={handleJoin}>
                    <CardContent>
                        {error && <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-3">{error}</div>}
                        <div className="flex gap-3">
                            <Input
                                id="code"
                                name="code"
                                placeholder="Например: A1B2C3"
                                className="font-mono uppercase text-lg tracking-widest placeholder:tracking-normal w-full"
                                required
                                maxLength={6}
                            />
                            <Button type="submit" disabled={isJoining} className="min-w-fit">
                                {isJoining ? "Поиск..." : "Присоединиться"}
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-950/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-800">
                        Вы пока не состоите ни в одном классе
                    </div>
                ) : (
                    classes.map((cls) => (
                        <Card key={cls.id} className="hover:shadow-md transition-shadow flex flex-col group">
                            <CardHeader>
                                <CardTitle className="line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cls.name}</CardTitle>
                                <CardDescription className="line-clamp-2 min-h-10">{cls.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto">
                                <Link href={`/class/${cls.code}`} className="w-full">
                                    <Button variant="default" className="w-full flex items-center justify-between text-left">
                                        <span>Открыть</span> <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
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
