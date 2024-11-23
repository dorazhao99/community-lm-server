import admin from "firebase-admin";
import serviceAccount from "./serviceKeys.json" assert { type: "json" };
import { initializeFirestore } from 'firebase-admin/firestore';


export const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
export const db = initializeFirestore(firebase, {
      experimentalForceLongPolling: true, // this line
      useFetchStreams: false, // and this line
})



// import { initializeApp, getApp } from 'firebase/app';
// import { getAuth, initializeAuth } from 'firebase/auth';
// import { initializeFirestore } from 'firebase/firestore';
// import config from './config.js';



// export const firebase = initializeApp(config.firebaseConfig);
// export const auth = initializeAuth(firebase)
// console.log(auth)


// function createFirebaseApp(config) {
//     try {
//       return getApp();
//     } catch {
//       return initializeApp(config);
//     }
//   }
  
// export const firebase = createFirebaseApp(config.firebaseConfig);
// export const auth = getAuth(firebase);
// console.log(auth)
// export const db = initializeFirestore(firebase, {
//     experimentalForceLongPolling: true, // this line
//     useFetchStreams: false, // and this line
// })
// console.log(auth)
// console.log(db)

// export {
//     firebase, 
//     db, 
//     auth
// };