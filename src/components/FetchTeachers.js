import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';


const FetchTeachers = async () => {
  const teachersCollection = collection(db, 'teacher');
  const teachersSnapshot = await getDocs(teachersCollection);
  const teachers = [];
  teachersSnapshot.forEach((doc) => {
    teachers.push(doc.data());
  }); //te
  return teachers;
};

export default FetchTeachers;
