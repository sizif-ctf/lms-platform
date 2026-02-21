import { cookies } from 'next/headers';
import { Profile } from '@/types';
import { getProfile } from './db';

// Simple mock session management
const SESSION_COOKIE_NAME = 'lms_session';

export async function setSession(profileId: string) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, profileId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionProfile(): Promise<Profile | null> {
    const cookieStore = await cookies();
    const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionValue) return null;

    const profile = await getProfile(sessionValue);
    return profile || null;
}
