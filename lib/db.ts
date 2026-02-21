import { prisma } from './prisma';
import { Role } from '@prisma/client';

// Generate short random codes for classes
const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// --- Auth & Profiles ---
export async function getProfile(id: string) {
    return prisma.profile.findUnique({
        where: { id },
    });
}

export async function createProfile(profile: { email: string; role: Role; full_name: string }) {
    return prisma.profile.create({
        data: profile,
    });
}

// --- Classes ---
export async function createClass(teacherId: string, name: string, description: string) {
    return prisma.classEntity.create({
        data: {
            teacher_id: teacherId,
            name,
            description,
            code: generateCode(),
        },
    });
}

export async function getClassByCode(code: string) {
    return prisma.classEntity.findUnique({
        where: { code },
    });
}

export async function getClassById(id: string) {
    return prisma.classEntity.findUnique({
        where: { id },
    });
}

export async function joinClass(classId: string, studentId: string) {
    // Check if membership already exists, otherwise create it. 
    // Uses upsert so we don't throw an error if they are already in the class.
    await prisma.classMember.upsert({
        where: {
            class_id_student_id: {
                class_id: classId,
                student_id: studentId,
            }
        },
        update: {},
        create: {
            class_id: classId,
            student_id: studentId,
        }
    });
}

export async function getClassesForTeacher(teacherId: string) {
    return prisma.classEntity.findMany({
        where: { teacher_id: teacherId },
        orderBy: { created_at: 'desc' },
    });
}

export async function getClassesForStudent(studentId: string) {
    return prisma.classEntity.findMany({
        where: {
            members: {
                some: {
                    student_id: studentId,
                }
            }
        },
        orderBy: { created_at: 'desc' },
    });
}

// --- Lectures ---
export async function createLecture(classId: string, title: string, content: string) {
    return prisma.lecture.create({
        data: {
            class_id: classId,
            title,
            content,
        },
    });
}

export async function getLectures(classId: string) {
    return prisma.lecture.findMany({
        where: { class_id: classId },
        orderBy: { created_at: 'asc' },
    });
}

// --- Assignments ---
export async function createAssignment(classId: string, title: string, description: string, maxScore: number) {
    return prisma.assignment.create({
        data: {
            class_id: classId,
            title,
            description,
            max_score: maxScore,
        },
    });
}

export async function getAssignments(classId: string) {
    return prisma.assignment.findMany({
        where: { class_id: classId },
        orderBy: { created_at: 'desc' },
    });
}

export async function getAssignment(id: string) {
    return prisma.assignment.findUnique({
        where: { id },
    });
}

// --- Submissions ---
export async function submitAssignment(assignmentId: string, studentId: string, content: string, fileUrl: string | null) {
    return prisma.submission.upsert({
        where: {
            assignment_id_student_id: {
                assignment_id: assignmentId,
                student_id: studentId,
            }
        },
        update: {
            content,
            file_url: fileUrl,
            submitted_at: new Date(),
        },
        create: {
            assignment_id: assignmentId,
            student_id: studentId,
            content,
            file_url: fileUrl,
        }
    });
}

export async function gradeSubmission(submissionId: string, score: number, comment: string) {
    await prisma.submission.update({
        where: { id: submissionId },
        data: {
            score,
            teacher_comment: comment,
        }
    });
}

export async function getSubmissionsForAssignment(assignmentId: string) {
    return prisma.submission.findMany({
        where: { assignment_id: assignmentId },
        include: {
            student: true,
        },
        orderBy: { submitted_at: 'desc' },
    });
}

export async function getSubmissionForStudent(assignmentId: string, studentId: string) {
    return prisma.submission.findUnique({
        where: {
            assignment_id_student_id: {
                assignment_id: assignmentId,
                student_id: studentId,
            }
        },
    });
}

// --- Materials ---
export async function createMaterial(classId: string, title: string, fileUrl: string) {
    return prisma.material.create({
        data: {
            class_id: classId,
            title,
            file_url: fileUrl,
        },
    });
}

export async function getMaterials(classId: string) {
    return prisma.material.findMany({
        where: { class_id: classId },
        orderBy: { created_at: 'desc' },
    });
}

// Get student users from a class
export async function getClassStudents(classId: string) {
    const members = await prisma.classMember.findMany({
        where: { class_id: classId },
        include: {
            student: true,
        },
    });
    return members.map(m => m.student);
}
