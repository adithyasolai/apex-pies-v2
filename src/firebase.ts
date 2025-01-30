import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Database, getDatabase } from "firebase/database";
import { firebaseConfig } from "./firebaseConfig";

// Using env variables to make it easy to switch between dev and prod environments.
const app: FirebaseApp = initializeApp(firebaseConfig);

// An authentication instance
export default app;
export const database: Database = getDatabase(app);
export const auth: Auth = getAuth(app);
