import { db } from "@/app/firebase";
import { TaskForm } from "@/app/page";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

export async function saveTodos(id: string, task: TaskForm) {
  try {
    const docRef = await addDoc(
      collection(db, "todos", id, "tasksCollection"),
      task
    );
    return docRef;
  } catch (error) {
    console.error(error);
  }
}

export async function getTodos(id: string) {
  try {
    const productRef = collection(db, "todos", id, "tasksCollection");
    const querySnapShot = await getDocs(productRef);
    return querySnapShot;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteTask(userId: string, tasktId: string) {
  try {
    const refs = collection(db, "todos", userId, "tasksCollection");
    const q = query(refs, where("id", "==", tasktId));
    const results = await getDocs(q);
    const docRef = results.docs[0].ref;
    await deleteDoc(docRef);
  } catch (error) {
    console.error(error);
  }
}
