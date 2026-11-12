import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export const verifyGoogleIdToken = (idToken) => {
  if (!getApps().length) {
    initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  }
  return getAuth().verifyIdToken(idToken);
};
