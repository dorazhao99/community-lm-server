import { db } from '../firebase.js';
import axios from 'axios';
import config from '../config.js';


export const getUser = async (req, res, next) => {
    console.log('Params', req.query)
  
    const userRef = db.collection(db, 'users').doc(req.query.id)
    const d = await userRef.get()
    if (!d.exists) {
      res.status(400).send('No doc')
    } else {
        const data = d.data()
        const response = {
            checked: data.checked,
            userName: data.userName, 
            displayName: data.displayName
        }
      res.status(200).send(response)
    }
}


export const createUser = async (req, res, next) => {
    // check auth token here
    const data = req.body
    const token = req.headers.authorization
    if (data.uid) {
        const response = await axios.get(`https://api.github.com/user/${data.githubID}`)
        const screenName = response.data ? response.data.login : ""
        const docRef = db.collection('users').doc(data.uid)
        const user = await docRef.get();
        console.log('User', user)
        if (!user.exists) {
            const d = {
                displayName: data.displayName,
                githubID: data.githubID,
                userName: screenName, 
                token: token,
            }
            try {
                await db.collection('users').doc(data.uid).set(d);
                const result = { uid: data.uid, signedIn: true }
                console.log('Document successfully created!');
                res.status(200).send({'success': true, 'res': result})
            } catch (error) {
                console.error('Error creating document:', error);
                res.status(200).send({'success': false, 'err': error})
            }
        } else {
            const d = {
                token: token,
                userName: screenName,
            }
            try {
                const userRef = db.collection('users').doc(data.uid)
                await userRef.update(d)
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


