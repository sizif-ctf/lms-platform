import Link from "next/link"
import { getSessionProfile } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, GraduationCap } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default async function Home() {
    const profile = await getSessionProfile()

    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-50">
            {/* Navbar */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-slate-950/80 dark:border-slate-800 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-500">
                        <GraduationCap className="w-8 h-8" />
                        LMS Platform
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        {profile ? (
                            <Link href="/dashboard">
                                <Button>Личный кабинет</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:inline-block">
                                    <Button variant="ghost">Войти</Button>
                                </Link>
                                <Link href="/register">
                                    <Button>Начать</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-8">
                    <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight">
                        Современная платформа <br className="hidden sm:block" />
                        для <span className="text-blue-600 dark:text-blue-500">эффективного</span> обучения
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Организуйте учебный процесс, создавайте курсы, отслеживайте прогресс студентов и улучшайте качество образования в одном месте.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        <Link href={profile ? "/dashboard" : "/register"}>
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14">
                                {profile ? "В личный кабинет" : "Создать аккаунт"} <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        {!profile && (
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 bg-white dark:bg-slate-950">
                                    Уже есть аккаунт? Войти
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 pt-24 text-left">
                        <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50 space-y-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">Лекции и задания</h3>
                            <p className="text-gray-600 dark:text-slate-400">Создавайте структурированные лекции с файлами и назначайте задания с рубрикатором.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50 space-y-4">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">Управление классами</h3>
                            <p className="text-gray-600 dark:text-slate-400">Быстро приглашайте учеников по 6-значному коду и отслеживайте их успеваемость.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/50 space-y-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">Оценка и фидбек</h3>
                            <p className="text-gray-600 dark:text-slate-400">Проверяйте сданные работы прямо на платформе и оставляйте комментарии ученикам.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
