import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';


const fetchTeachers = async () => {
  const teachersCollection = collection(db, 'teacher');
  const teachersSnapshot = await getDocs(teachersCollection);
  const teachers = [];
  teachersSnapshot.forEach((doc) => {
    teachers.push(doc.data());
  });
  return teachers;
};

export default fetchTeachers;