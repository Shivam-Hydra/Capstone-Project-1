/**
 * Firebase Admin SDK initializer — server-side only.
 * Uses Application Default Credentials when GOOGLE_APPLICATION_CREDENTIALS is set,
 * or falls back to project ID from the client-side env var for local dev.
 *
 * Call initAdminApp() before any firebase-admin calls.
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";

let adminApp: App | null = null;

export function initAdminApp(): App {
    if (adminApp) return adminApp;
    if (getApps().length > 0) {
        adminApp = getApps()[0];
        return adminApp;
    }

    // In production: set GOOGLE_APPLICATION_CREDENTIALS env var to a service account JSON path.
    // In dev: we use the projectId alone (only token verification works, not Firestore writes).
    adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

    return adminApp;
}
