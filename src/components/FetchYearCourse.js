import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';


const FetchYearCourse = async () => {
  const yearCollection = collection(db, 'course');
  const yearSnapshot = await getDocs(yearCollection);
  const year = [];
  yearSnapshot.forEach((doc) => {
    year.push(doc.data());
  });
  return year;
};

export default FetchYearCourse;
