import { auth, db } from '../firebase.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { GithubAuthProvider, signInWithCredential } from "firebase/auth";
import axios from 'axios';
import config from '../config.js';

const BEARER_TOKEN = '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'
// const db = initializeFirestore(firebase, {
//     experimentalForceLongPolling: true, // this line
//     useFetchStreams: false, // and this line
// })

//get all modules
export const getUser = async (req, res, next ) => {
    const user = auth.currentUser;
    console.log('Current user', user)
    if (user) {
        res.status(200).send({'isSigned': true, 'user': user})
    } else {
        // No user is signed in.
        res.status(200).send({'isSigned': false, 'user': null})
    }

};

export const authorizeUser = async (req, res, next) => {
    const { code } = req.body
    const params = {
        client_id: 'Ov23liLwNSMD79SKhrlJ',
        client_secret: '3db2be92b7e3e2bda51330398ced53d1ad3f84e2',
        code: code
    }
    
    const response = await axios.post('https://github.com/login/oauth/access_token', null, {
        params: params,
        headers: {
            Accept: 'application/json', // Requesting a JSON response
        },
    })
    if (response.data) {
        const token = response.data.access_token
        res.status(200).send({'success': true, 'token': token})
    } else {
        res.status(200).send({'success': false, 'error': 'No token'})
    }
    // console.log('Login Github', response)
    // const token = response.data.access_token
    
    // if (token) {
    //     console.log('Token', token)
    //     const credential = GithubAuthProvider.credential(token);
    //     console.log('Credential', credential)
    //     console.log(auth)
    //     await signInWithCredential(auth, credential)
    //     .then((result) => {
    //         // Signed in 
    //         console.log('Current user', auth.currentUser)
    //         res.status(200).send({'success': true, 'user': result, 'token': token})
    //     })
    //     .catch((error) => {
    //         // Handle Errors here.
    //         console.error(error)
    //         res.status(200).send({'success': false, 'error': error})
    //         // ...
    //     });
    // } else {
    //     res.status(200).send({'success': false, 'error': 'No token'})
    // }
};

export const createUser = async (req, res, next) => {
    const data = req.body
    console.log('Data User', data)
    if (data.uid) {
        const response = await axios.get(`https://api.github.com/user/${data.githubID}`)
        const screenName = response.data ? response.data.login : ""
        const docRef = doc(db, 'users', data.uid);
        const user = await getDoc(docRef);
        console.log('User', user)
        if (!user.exists()) {
            const d = {
                displayName: data.displayName,
                githubID: data.githubID,
                userName: screenName, 
                token: data.token,
            }
            try {
                await setDoc(docRef, d);
                const result = { uid: data.uid, signedIn: true }
                console.log('Document successfully created!');
                res.status(200).send({'success': true, 'res': result})
            } catch (error) {
                console.error('Error creating document:', error);
                res.status(200).send({'success': false, 'err': error})
            }
        } else {
            const d = {
                token: data.token,
                userName: screenName,
            }
            try {
                await updateDoc(docRef, d);  // Update the existing document with the new data
                console.log('Document successfully updated!');
                const result = { uid: data.uid, signedIn: true }
                res.status(200).send({'success': true, 'res': result})
            } catch (error) {
                console.error('Error updating document:', error);
                res.status(200).send({'success': false, 'err': error})
            }
        }
    }
}


