import { redirect } from "next/navigation"
import { getSessionProfile } from "@/lib/session"
import { getClassByCode, getClassStudents } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail } from "lucide-react"

export default async function ClassMembersPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params
    const profile = await getSessionProfile()
    if (!profile) redirect("/login")

    const classData = await getClassByCode(code)
    if (!classData || classData.teacher_id !== profile.id) {
        redirect(`/class/${code}`)
    }

    const students = await getClassStudents(classData.id)

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50">Ученики класса</h2>
                <p className="text-gray-500 dark:text-slate-400">Список участников ({students.length})</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {students.length === 0 ? (
                    <div className="col-span-full py-8 text-center bg-white dark:bg-slate-950 border border-dashed border-gray-300 dark:border-slate-800 rounded-xl text-gray-500 dark:text-slate-400">
                        В этом классе пока нет учеников. Раздайте им код класса: <b className="text-blue-600 dark:text-blue-500">{classData.code}</b>
                    </div>
                ) : (
                    students.map((student) => (
                        <Card key={student.id} className="shadow-sm dark:bg-slate-950 dark:border-slate-800">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-900/50 flex-shrink-0">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-slate-100 truncate">{student.full_name}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">
                                        <Mail className="w-3.5 h-3.5" />
                                        {student.email}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
