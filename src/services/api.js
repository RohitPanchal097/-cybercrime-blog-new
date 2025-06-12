import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyCnxoEAyOErwywVp0CYnRKGNY4FO7k2v5Y",
  authDomain: "cybercel-62531.firebaseapp.com",
  projectId: "cybercel-62531",
  storageBucket: "cybercel-62531.appspot.com",
  messagingSenderId: "851391911380",
  appId: "1:851391911380:web:dd38a0ce110b96a4b37241",
  measurementId: "G-DBPF6VY6D4"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

// Posts API calls using Firestore
export const postsAPI = {
  getAllPosts: async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  getPostById: async (id) => {
    const postDoc = await getDoc(doc(db, 'posts', id));
    return postDoc.exists() ? { id: postDoc.id, ...postDoc.data() } : null;
  },
  createPost: async (postData) => {
    try {
      let imageUrl = postData.image;
      if (postData.image instanceof File) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `uploads/${Date.now()}-${postData.image.name}`);
        await uploadBytes(storageRef, postData.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Create post in Firestore with the image URL
      const docRef = await addDoc(collection(db, "posts"), {
        ...postData,
        image: imageUrl,
        createdAt: new Date()
      });
      
      return { id: docRef.id, ...postData, image: imageUrl };
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },
  updatePost: async (id, postData) => {
    let imageUrl = postData.image;
    if (postData.image && postData.image instanceof File) {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `uploads/${Date.now()}-${postData.image.name}`);
      await uploadBytes(storageRef, postData.image);
      imageUrl = await getDownloadURL(storageRef);
    }
    // Update post in Firestore
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, { ...postData, image: imageUrl });
    return { id, ...postData, image: imageUrl };
  },
  deletePost: async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    return { id };
  }
};

export default firebaseApp; 