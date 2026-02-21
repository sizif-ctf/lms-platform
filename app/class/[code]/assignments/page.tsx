import { redirect } from "next/navigation"
import Link from "next/link"
import { getSessionProfile } from "@/lib/session"
import { getClassByCode, getAssignments } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CheckSquare, Plus, ArrowRight } from "lucide-react"

export default async function ClassAssignmentsPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params
    const profile = await getSessionProfile()
    if (!profile) redirect("/login")

    const classData = await getClassByCode(code)
    if (!classData) redirect("/dashboard")

    const isTeacher = profile.role === "teacher" && classData.teacher_id === profile.id
    const assignments = await getAssignments(classData.id)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50">Задания курса</h2>
                    <p className="text-gray-500 dark:text-slate-400">Практические работы для проверки знаний</p>
                </div>

                {isTeacher && (
                    <Link href={`/class/${code}/assignments/create`}>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Добавить задание
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {assignments.length === 0 ? (
                    <div className="col-span-full p-8 text-center bg-white dark:bg-slate-950 border border-dashed border-gray-300 dark:border-slate-800 rounded-xl text-gray-500 dark:text-slate-400">
                        В этом классе пока нет заданий.
                    </div>
                ) : (
                    assignments.map((assignment) => (
                        <Card key={assignment.id} className="hover:shadow-md transition-shadow flex flex-col group">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/50 w-fit px-2 py-0.5 rounded text-xs font-semibold mb-2">
                                    <CheckSquare className="w-3.5 h-3.5" />
                                    <span>ЗАДАНИЕ</span>
                                </div>
                                <CardTitle>{assignment.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    Максимальный балл: {assignment.max_score}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pb-2">
                                <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-3">{assignment.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/class/${code}/assignments/${assignment.id}`} className="w-full">
                                    <Button variant="outline" className="w-full justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/70 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                                        {isTeacher ? "Проверить ответы" : "Сдать задание"}
                                        <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100" />
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
