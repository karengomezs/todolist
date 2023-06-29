import { db } from "@/app/firebase";
import { Task } from "@/app/page";
import { addDoc, collection, getDocs } from "firebase/firestore";

export async function saveTodos(id: string, task: Task) {
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
    const productRef = collection(db, "cart", id, "productsCollection");
    const querySnapShot = await getDocs(productRef);

    return querySnapShot;
  } catch (error) {
    console.error(error);
  }
}
