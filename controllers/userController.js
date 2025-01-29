import { db } from '../firebase.js';
import axios from 'axios';
import { logger } from '../libs/logger.js'
import config from '../config.js';


export const getUser = async (req, res, next) => {
    console.log('Params', req.query)
  
    const userRef = db.collection('users').doc(req.query.id)
    const d = await userRef.get()
    if (!d.exists) {
      res.status(200).send({isUser: false})
    } else {
        const data = d.data()
        if (data) {
            const response = {
                checked: data.checked ? data.checked : {},
                userName: data.userName, 
                displayName: data.displayName, 
                isUser: true
            }
          res.status(200).send(response)
        } else {
            res.status(200).send({isUser: false})
        }
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
                modules: ['Owpgm2DXhp0a0dnM1gZa'],
                numMessages: 0,
                checked: {}
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
                await docRef.update(d)
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

export const updateChecked= async (req, res, next) => {
    const data = req.body
    const docRef = db.collection('users').doc(data.uid)
    const user = await docRef.get();
    console.log('User', user)
    if (user.exists) {
        const d = {
            checked: data.checked,
        }
        try {
            const result = await docRef.update(d)
            console.log('Document successfully updated!');

            res.status(200).send({'success': true, 'res': result})
        } catch (error) {
            res.status(200).send({'success': false, 'err': error})
        }
    } else {
        res.status(200).send({'success': false, 'err': 'User does not exist'})
    }
}

export const updateCount= async(req, res, next) => {
    const data = req.body
    console.log('Count', data)
    const docRef = db.collection('users').doc(data.uid)
    const user = await docRef.get();
    if (user.exists) {
        const storedData = user.data().numMessages ? user.data().numMessages : 0
        const d = {
            numMessages: storedData + 1,
        }
        try {
            const result = await docRef.update(d)
            console.log('Document successfully updated!');
            res.status(200).send({'success': true, 'res': result})
        } catch (error) {
            console.log(error)
            res.status(200).send({'success': false, 'err': error})
        }
    } else {
        res.status(200).send({'success': false, 'err': 'User does not exist'})
    }
}


