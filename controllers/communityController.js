import { firebase, db } from '../firebase.js';
import Community from '../models/modulesCommunity.js';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  initializeFirestore
} from 'firebase/firestore';


//get all communities

export const getCommunities = async (req, res, next) => {
    const comms = await getDocs(collection(db, 'communities'));

    const commsArray = [];

    for (const commDoc of comms.docs) {
        const commData = commDoc.data();
        const moduleRefs = commData.modules;

        // Fetch authors
        const modulePromises = moduleRefs.map(ref => getDoc(ref));
        const moduleSnaps = await Promise.all(modulePromises);

        const modules = moduleSnaps.map(moduleSnap => ({
            id: moduleSnap.id,
            ...moduleSnap.data()
        }));

        const c = new Community(
            commDoc.id,
            commData.name, 
            commData.description, 
            modules
        );
        commsArray.push(c);
    }

    res.status(200).send(commsArray);
};

// export const getCommunities = async (req, res, next) => {
//   try {
//     const comms = await getDocs(collection(db, 'communities'));
//     const commArray = [];

//     if (comms.empty) {
//       res.status(400).send('No Products found');
//     } else {
//       comms.forEach((doc) => {
//         moduleRefs = doc.data().modules
//         const modulePromises = moduleRefs.map(ref => getDoc(ref));
//         const moduleSnaps = await Promise.all(authorsPromises);

//         const c = new Community(
//           doc.id,
//           doc.data().name, 
//           doc.data().description, 
//         );
//         commArray.push(c);
//       });

//       res.status(200).send(commArray);
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// export const createModule = async (req, res, next) => {
//     try {
//       const data = req.body;
//       await addDoc(collection(db, 'modules'), data);
//       res.status(200).send('module created successfully');
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   };