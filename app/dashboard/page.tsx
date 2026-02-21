import { redirect } from "next/navigation"
import { getSessionProfile } from "@/lib/session"
import { getClassesForTeacher, getClassesForStudent } from "@/lib/db"
import TeacherDashboard from "./TeacherDashboard"
import StudentDashboard from "./StudentDashboard"
import { GraduationCap, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default async function DashboardPage() {
    const profile = await getSessionProfile()

    if (!profile) {
        redirect("/login")
    }

    const classes = profile.role === "teacher"
        ? await getClassesForTeacher(profile.id)
        : await getClassesForStudent(profile.id)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
            <header className="bg-white border-b border-gray-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-500">
                        <GraduationCap className="w-8 h-8" />
                        LMS Dashboard
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">{profile.full_name}</span>
                            <span className="text-xs text-gray-500 dark:text-slate-400 capitalize">{profile.role === 'teacher' ? 'Учитель' : 'Ученик'}</span>
                        </div>
                        <form action={logout}>
                            <Button type="submit" variant="ghost" size="icon" title="Выйти">
                                <LogOut className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
                <div className="mb-8 border-b border-gray-200 dark:border-slate-800 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Мои классы</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">
                        {profile.role === "teacher"
                            ? "Управляйте своими учебными группами и контентом"
                            : "Классы, в которых вы обучаетесь"}
                    </p>
                </div>

                {profile.role === "teacher" ? (
                    <TeacherDashboard classes={classes} />
                ) : (
                    <StudentDashboard classes={classes} />
                )}
            </main>
        </div>
    )
}
