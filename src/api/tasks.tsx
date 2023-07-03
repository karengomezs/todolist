import { db } from "@/app/firebase";
import { TaskForm } from "@/app/page";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
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

export async function deleteTask(userId: string, taskId: string) {
  try {
    return await deleteDoc(doc(db, "todos", userId, "tasksCollection", taskId));
  } catch (error) {
    console.error(error);
  }
}

export async function updateTask(
  userId: string,
  taskId: string,
  status: "pending" | "done"
) {
  try {
    const docRef = doc(db, "todos", userId, "tasksCollection", taskId);
    await updateDoc(docRef, {
      status: status,
    });
  } catch (error) {}
}
