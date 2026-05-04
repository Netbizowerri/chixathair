import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  Firestore
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage
} from "firebase/storage";
import { Product, Order } from "../types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const getFirebase = (): FirebaseApp => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
};

const getDB = (): Firestore | null => {
  try {
    const app = getFirebase();
    return getFirestore(app);
  } catch (error) {
    console.error("Firestore init error:", error);
    return null;
  }
};

const getStorageInstance = (): FirebaseStorage | null => {
  try {
    const app = getFirebase();
    return getStorage(app);
  } catch (error) {
    console.error("Storage init error:", error);
    return null;
  }
};

// Media Upload
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storage = getStorageInstance();
  if (!storage) throw new Error("Storage unavailable");

  const storageRef = ref(storage, `artisan-media/${Date.now()}-${path}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

// Products
export const getProducts = async (): Promise<Product[]> => {
  const firestore = getDB();
  if (!firestore) return [];
  try {
    const querySnapshot = await getDocs(collection(firestore, "products"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error("getProducts error:", error);
    return [];
  }
};

export const saveProduct = async (product: Partial<Product>) => {
  const firestore = getDB();
  if (!firestore) throw new Error("Firestore unavailable");

  const productToSave = { ...product };
  const id = productToSave.id;
  delete productToSave.id;

  if (id) {
    const docRef = doc(firestore, "products", id);
    await updateDoc(docRef, productToSave as any);
    return id;
  } else {
    const docRef = await addDoc(collection(firestore, "products"), productToSave);
    return docRef.id;
  }
};

export const seedDatabase = async (initialProducts: Product[]) => {
  const firestore = getDB();
  if (!firestore) return;

  try {
    for (const p of initialProducts) {
      const docRef = doc(firestore, "products", p.id);
      const productToSave = { ...p };
      delete (productToSave as any).id;
      await setDoc(docRef, productToSave, { merge: true });
    }
    console.log("Artisan inventory synchronized successfully.");
  } catch (e) {
    console.error("Seed database error:", e);
  }
};

export const deleteProduct = async (id: string) => {
  const firestore = getDB();
  if (!firestore) throw new Error("Firestore unavailable");
  await deleteDoc(doc(firestore, "products", id));
};

// Orders
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
  const firestore = getDB();
  if (!firestore) throw new Error("Firestore unavailable");
  const docRef = await addDoc(collection(firestore, "orders"), {
    ...order,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getOrders = async (): Promise<Order[]> => {
  const firestore = getDB();
  if (!firestore) return [];
  try {
    const q = query(collection(firestore, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toLocaleString()
          : 'Unknown'
      } as Order;
    });
  } catch (error) {
    console.error("getOrders error:", error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const firestore = getDB();
  if (!firestore) throw new Error("Firestore unavailable");
  await updateDoc(doc(firestore, "orders", orderId), { status });
};

// Categories
export const getCategories = async (): Promise<string[]> => {
  const firestore = getDB();
  if (!firestore) return ['Affordable Hairs'];
  try {
    const querySnapshot = await getDocs(collection(firestore, "categories"));
    if (querySnapshot.empty) {
      return ['Affordable Hairs'];
    }
    return querySnapshot.docs.map(doc => doc.data().name as string);
  } catch (error) {
    console.error("getCategories error:", error);
    return ['Affordable Hairs'];
  }
};

export const saveCategory = async (name: string) => {
  const firestore = getDB();
  if (!firestore) throw new Error("Firestore unavailable");
  await addDoc(collection(firestore, "categories"), { name });
};

export const deleteCategory = async (name: string) => {
  const firestore = getDB();
  if (!firestore) throw new Error("Firestore unavailable");
  const q = query(collection(firestore, "categories"));
  const querySnapshot = await getDocs(q);
  const categoryDoc = querySnapshot.docs.find(doc => doc.data().name === name);
  if (categoryDoc) {
    await deleteDoc(doc(firestore, "categories", categoryDoc.id));
  }
};