import { db } from "@/app/firebase";
import { Task } from "@/app/page";
import { addDoc, collection, getDocs, writeBatch } from "firebase/firestore";

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
    const productRef = collection(db, "todos", id, "tasksCollection");
    const querySnapShot = await getDocs(productRef);
    return querySnapShot;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProductsCart(userId: string) {
  try {
    const batch = writeBatch(db);

    const refs = collection(db, "todos", userId, "tasksCollection");
    const results = await getDocs(refs);

    results.forEach((product) => {
      batch.delete(product.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error(error);
  }
}
