import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// You'll need to replace this with your actual service account file name
import serviceAccount from "../serviceAccountKey.json";

// initialize the Firebase app with our service account key
initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

// get a reference to the firestore database
const db: Firestore = getFirestore();

export { db };
