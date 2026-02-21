import { redirect } from "next/navigation"
import { getSessionProfile } from "@/lib/session"
import { getClassByCode, getMaterials } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { FileText, Download, Plus } from "lucide-react"

async function CreateMaterialForm({ classCode }: { classCode: string }) {
    // We use inline server action here since component is an RSC, 
    // but it needs to be in a separate file with "use server" or we can just import the action from content.ts
    return (
        <Card className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
            <CardContent className="p-4 sm:p-6">
                <form action={async (formData) => {
                    'use server'
                    const { createMaterialAction } = await import('@/app/actions/content')
                    await createMaterialAction(classCode, formData)
                }} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="space-y-1.5 w-full sm:w-1/3">
                        <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="title">Название файла</label>
                        <input id="title" name="title" required className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50 text-sm focus:outline-none focus:border-blue-500" placeholder="Учебник 10 класс" />
                    </div>
                    <div className="space-y-1.5 w-full sm:flex-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="fileUrl">Ссылка на файл</label>
                        <input id="fileUrl" name="fileUrl" type="url" required className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50 text-sm focus:outline-none focus:border-blue-500" placeholder="https://..." />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Добавить
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default async function ClassMaterialsPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params
    const profile = await getSessionProfile()
    if (!profile) redirect("/login")

    const classData = await getClassByCode(code)
    if (!classData) redirect("/dashboard")

    const isTeacher = profile.role === "teacher" && classData.teacher_id === profile.id
    const materials = await getMaterials(classData.id)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50">Учебные материалы</h2>
                <p className="text-gray-500 dark:text-slate-400">Дополнительные файлы, учебники и методички</p>
            </div>

            {isTeacher && <CreateMaterialForm classCode={code} />}

            <div className="grid sm:grid-cols-2 gap-4">
                {materials.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-950 rounded-xl border border-dashed border-gray-300 dark:border-slate-800">
                        Нет доступных материалов.
                    </div>
                ) : (
                    materials.map((material) => (
                        <div key={material.id} className="bg-white dark:bg-slate-950 rounded-xl p-4 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-gray-300 dark:hover:border-slate-700 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-2.5 rounded-lg flex-shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-medium text-gray-900 dark:text-slate-100 truncate" title={material.title}>{material.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">{new Date(material.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 ml-2 flex-shrink-0">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
