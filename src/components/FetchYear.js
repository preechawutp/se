import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';


const FetchYear = async () => {
  const yearCollection = collection(db, 'ChooseSubject');
  const yearSnapshot = await getDocs(yearCollection);
  const year = [];
  yearSnapshot.forEach((doc) => {
    year.push(doc.data());
  });
  return year;
};

export default FetchYear;
