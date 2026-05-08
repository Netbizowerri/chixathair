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
import { Product, Order } from "../types";
import imageCompression from "browser-image-compression";

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

// Compress image and convert to Base64 data URL for Firestore storage
export const compressImageToBase64 = async (file: File): Promise<string> => {
  const options = {
    maxSizeMB: 0.2, // ~200KB max per image to stay under 1MB doc limit with 3 images
    maxWidthOrHeight: 800,
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
    return base64;
  } catch (error) {
    console.error("Image compression error:", error);
    // Fallback: convert original file to base64
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

// Admin Media Upload — stores image as Base64 directly in Firestore
export const uploadFileAdmin = async (file: File, filename: string): Promise<string> => {
  // Only images supported for Base64 storage (videos must use external URL)
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded. Videos must be added via URL.');
  }

  const base64 = await compressImageToBase64(file);
  return base64;
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