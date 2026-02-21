import { redirect } from "next/navigation"
import Link from "next/link"
import { getClassByCode } from "@/lib/db"
import { getSessionProfile } from "@/lib/session"
import { BookOpen, FileText, CheckSquare, Users, ArrowLeft } from "lucide-react"

export default async function ClassLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ code: string }>
}) {
    const { code } = await params
    const profile = await getSessionProfile()

    if (!profile) {
        redirect("/login")
    }

    const classData = await getClassByCode(code)
    if (!classData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Класс не найден</h2>
                    <Link href="/dashboard" className="text-blue-600 hover:underline">Вернуться на главную</Link>
                </div>
            </div>
        )
    }

    const isTeacher = profile.role === "teacher" && classData.teacher_id === profile.id
    // We should ideally check if student is enrolled, but for the mock demo, we'll allow access if they have the code

    const tabs = [
        { name: "Лекции", href: `/class/${code}`, icon: BookOpen },
        { name: "Задания", href: `/class/${code}/assignments`, icon: CheckSquare },
        { name: "Материалы", href: `/class/${code}/materials`, icon: FileText },
    ]

    if (isTeacher) {
        tabs.push({ name: "Ученики", href: `/class/${code}/members`, icon: Users })
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
            <header className="bg-white border-b border-gray-200 dark:bg-slate-950 dark:border-slate-800 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4 flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-50 sm:text-2xl">{classData.name}</h1>
                            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block border border-blue-100 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-900">
                                Код: {classData.code}
                            </span>
                        </div>
                    </div>

                    <nav className="flex space-x-8 overflow-x-auto pb-px scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700"
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}
