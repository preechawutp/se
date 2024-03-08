
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyArngwzT3-9iPN9fGtIUEqsTqX_MjaS6hA",
  authDomain: "se-project-87de4.firebaseapp.com",
  projectId: "se-project-87de4",
  storageBucket: "se-project-87de4.appspot.com",
  messagingSenderId: "1044138830726",
  appId: "1:1044138830726:web:f495e84e53343174d65a07",
  measurementId: "G-HXN45W8JYR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const copySelectedCourseToChooseSubject = async () => {
  try {
    // Retrieve data from the "selected_course" collection
    const querySnapshot = await getDocs(collection(db, 'selected_course'));
    // Loop through each document and add it to the "ChooseSubject" collection
    querySnapshot.forEach(async (doc) => {
      await addDoc(collection(db, 'ChooseSubject'), doc.data());
    });
    console.log('All documents copied successfully.');
  } catch (error) {
    console.error('Error copying documents: ', error);
  }
};

const copySelectedCourseToNewFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'course'));
    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      const { grade } = data; // เอา { grade } ออกเพราะไม่จำเป็นต้องทำ destructuring ในที่นี้
      const newCollectionName = `course_${grade}`;
      
      // ตรวจสอบว่ามี collection ที่ต้องการสร้างอยู่แล้วหรือไม่
      const existingCollectionSnapshot = await getDocs(collection(db, newCollectionName));
      existingCollectionSnapshot.forEach(async (existingDoc) => {
        await deleteDoc(existingDoc.ref);
      });
      
      // สร้าง collection ใหม่และคัดลอกข้อมูล
      await addDoc(collection(db, newCollectionName), data);
    });
    console.log('All documents copied successfully.');
  } catch (error) {
    console.error('Error copying documents: ', error);
  }
};


export { db, app, auth, provider, copySelectedCourseToChooseSubject, copySelectedCourseToNewFirestore };