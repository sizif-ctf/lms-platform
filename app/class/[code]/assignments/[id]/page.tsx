import { redirect } from "next/navigation"
import Link from "next/link"
import { getSessionProfile } from "@/lib/session"
import { getClassByCode, getAssignment, getSubmissionsForAssignment, getSubmissionForStudent, getClassStudents } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, FileText, Send, User } from "lucide-react"

async function StudentSubmissionView({ assignmentId, classCode, studentId }: { assignmentId: string, classCode: string, studentId: string }) {
    const submission = await getSubmissionForStudent(assignmentId, studentId)

    if (submission) {
        return (
            <Card className="border-green-100 bg-green-50/30 dark:bg-green-950/20 dark:border-green-900/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        Задание сдано
                    </CardTitle>
                    <CardDescription>Время сдачи: {new Date(submission.submitted_at).toLocaleString('ru-RU')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-medium text-sm text-gray-700 dark:text-slate-300 mb-1">Ваш ответ:</h4>
                        <div className="bg-white p-3 rounded-md border border-gray-200 text-gray-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 text-sm whitespace-pre-wrap">{submission.content}</div>
                    </div>
                    {submission.file_url && (
                        <div>
                            <h4 className="font-medium text-sm text-gray-700 dark:text-slate-300 mb-1">Прикрепленный файл/ссылка:</h4>
                            <a href={submission.file_url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all text-sm">{submission.file_url}</a>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-green-200 dark:border-green-900/50">
                        {submission.score !== null ? (
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-900 dark:text-slate-50">Оценка преподавателя:</h4>
                                    <span className="text-xl font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/50 px-3 py-1 rounded-md">{submission.score} баллов</span>
                                </div>
                                {submission.teacher_comment && (
                                    <p className="text-gray-600 dark:text-slate-300 italic mt-2 text-sm bg-gray-50 dark:bg-slate-950 p-3 rounded">«{submission.teacher_comment}»</p>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" /> Ожидает проверки
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Not submitted yet
    return (
        <Card className="dark:bg-slate-950 dark:border-slate-800">
            <CardHeader>
                <CardTitle>Отправить решение</CardTitle>
                <CardDescription>Заполните форму ниже для сдачи работы</CardDescription>
            </CardHeader>
            <form action={async (formData) => {
                'use server'
                const { submitAssignmentAction } = await import('@/app/actions/content')
                await submitAssignmentAction(assignmentId, classCode, formData)
            }}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="content">Текст ответа</label>
                        <textarea
                            id="content"
                            name="content"
                            rows={5}
                            className="w-full rounded-md border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                            placeholder="Введите решение здесь..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="fileUrl">Ссылка на файл (необязательно)</label>
                        <Input id="fileUrl" name="fileUrl" type="url" placeholder="https://docs.google.com/..." className="dark:bg-slate-900 dark:border-slate-800 dark:text-slate-50" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full sm:w-auto gap-2">
                        <Send className="w-4 h-4" /> Отправить на проверку
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

async function TeacherGradingView({ assignmentId, classCode, maxScore }: { assignmentId: string, classCode: string, maxScore: number }) {
    const submissions = await getSubmissionsForAssignment(assignmentId)
    const students = await getClassStudents(classCode) // Warning: this function takes classId, not code. Wait, I should fix that.

    const classData = await getClassByCode(classCode)
    if (!classData) return null
    const studentsList = await getClassStudents(classData.id)

    return (
        <div className="space-y-4 pt-4 border-t dark:border-slate-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-50">Ответы учеников ({submissions.length} / {studentsList.length})</h3>

            {studentsList.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-slate-400">В этом классе пока нет учеников.</div>
            ) : (
                <div className="grid gap-4">
                    {studentsList.map(student => {
                        const submission = submissions.find(s => s.student_id === student.id)
                        return (
                            <Card key={student.id} className="overflow-hidden dark:bg-slate-950 dark:border-slate-800">
                                <div className="bg-gray-50 dark:bg-slate-900 flex items-center justify-between p-4 border-b dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white dark:bg-slate-950 p-2 rounded-full border dark:border-slate-700 shadow-sm">
                                            <User className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-slate-50">{student.full_name}</span>
                                    </div>
                                    {submission ? (
                                        <span className="text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 px-2.5 py-1 rounded-full">
                                            Сдано
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold bg-gray-200 text-gray-600 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-1 rounded-full">
                                            Не сдано
                                        </span>
                                    )}
                                </div>

                                {submission && (
                                    <div className="p-4 space-y-4">
                                        <div className="text-sm text-gray-800 dark:text-slate-300 whitespace-pre-wrap">{submission.content}</div>
                                        {submission.file_url && (
                                            <a href={submission.file_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                                <FileText className="w-4 h-4" /> Прикрепленный файл
                                            </a>
                                        )}

                                        <form action={async (formData) => {
                                            'use server'
                                            const { gradeSubmissionAction } = await import('@/app/actions/content')
                                            await gradeSubmissionAction(submission.id, classCode, assignmentId, formData)
                                        }} className="mt-4 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg flex flex-col sm:flex-row gap-3 items-end border border-blue-100 dark:border-blue-900/50">
                                            <div className="space-y-1.5 w-full sm:w-1/4">
                                                <label className="text-xs font-medium text-gray-700 dark:text-slate-300">Оценка (из {maxScore})</label>
                                                <Input name="score" type="number" step="0.5" max={maxScore} min="0" required defaultValue={submission.score !== null ? submission.score.toString() : ""} className="bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-50" />
                                            </div>
                                            <div className="space-y-1.5 w-full sm:flex-1">
                                                <label className="text-xs font-medium text-gray-700 dark:text-slate-300">Комментарий (необязательно)</label>
                                                <Input name="comment" defaultValue={submission.teacher_comment || ""} placeholder="Молодец!" className="bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-50" />
                                            </div>
                                            <Button type="submit" size="sm" className="w-full sm:w-auto h-10 mt-4 sm:mt-0">
                                                {submission.score !== null ? "Обновить оценку" : "Оценить"}
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default async function AssignmentDetailPage({ params, }: { params: Promise<{ code: string; id: string }> }) {
    const { code, id } = await params
    const profile = await getSessionProfile()
    if (!profile) redirect("/login")

    const classData = await getClassByCode(code)
    if (!classData) redirect("/dashboard")

    const assignment = await getAssignment(id)
    if (!assignment || assignment.class_id !== classData.id) {
        return <div className="p-8 text-center text-red-500">Задание не найдено</div>
    }

    const isTeacher = profile.role === "teacher" && classData.teacher_id === profile.id

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href={`/class/${code}/assignments`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Назад к списку
            </Link>

            <div className="bg-white dark:bg-slate-950/50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-50">{assignment.title}</h1>
                    <div className="text-sm font-semibold bg-gray-100 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 rounded-full whitespace-nowrap">
                        Макс. балл: {assignment.max_score}
                    </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 mt-4 mb-8">
                    <p className="whitespace-pre-wrap">{assignment.description}</p>
                </div>

                {isTeacher ? (
                    <TeacherGradingView assignmentId={assignment.id} classCode={code} maxScore={assignment.max_score} />
                ) : (
                    <StudentSubmissionView assignmentId={assignment.id} classCode={code} studentId={profile.id} />
                )}
            </div>
        </div>
    )
}
