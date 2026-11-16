import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

initializeApp({
    credential: applicationDefault(),
});

const db: Firestore = getFirestore();

export { db };