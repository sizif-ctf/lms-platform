import { redirect } from "next/navigation"
import Link from "next/link"
import { getSessionProfile } from "@/lib/session"
import { getClassByCode, getLectures } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus } from "lucide-react"

export default async function ClassLecturesPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params
    const profile = await getSessionProfile()
    if (!profile) redirect("/login")

    const classData = await getClassByCode(code)
    if (!classData) redirect("/dashboard")

    const isTeacher = profile.role === "teacher" && classData.teacher_id === profile.id
    const lectures = await getLectures(classData.id)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50">Материалы лекций</h2>
                    <p className="text-gray-500 dark:text-slate-400">Теоретический материал для изучения</p>
                </div>

                {isTeacher && (
                    <Link href={`/class/${code}/create-lecture`}>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Добавить лекцию
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid gap-4">
                {lectures.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-slate-950 border border-dashed border-gray-300 dark:border-slate-800 rounded-xl text-gray-500 dark:text-slate-400">
                        В этом классе пока нет лекций.
                    </div>
                ) : (
                    lectures.map((lecture) => (
                        <Card key={lecture.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 mb-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Лекция</span>
                                </div>
                                <CardTitle>{lecture.title}</CardTitle>
                                <CardDescription>
                                    Добавлено: {new Date(lecture.created_at).toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="prose dark:prose-invert max-w-none text-gray-700 dark:text-slate-300">
                                <p className="whitespace-pre-wrap">{lecture.content}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
