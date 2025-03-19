import { db } from '../firebase.js';
import config from '../config.js';

export const createSurvey = async (req, res, next) => {
    // check auth token here
    const data = req.body
    if (data.uid) {
        const docRef = db.collection('survey').doc(data.uid)
        const surveyResponse = await docRef.get();
        if (!surveyResponse.exists) {
            try {
                await db.collection('survey').doc(data.uid).set(data);
                res.status(200).send({'success': true})
            } catch (error) {
                console.error('Error creating document:', error);
                res.status(200).send({'success': false})
            }
        } else {
            try {
                await docRef.update(data)
                res.status(200).send({'success': true})
            } catch (error) {
                console.error('Error updating document:', error);
                res.status(200).send({'success': false})
            }
        }
    }
}

export const getPreferencePairs = async (req, res, next) => {  
    const userRef = db.collection('users').doc(req.query.id)
    const d = await userRef.get()
    if (!d.exists) {
      res.status(200).send({isUser: false})
    } else {
        const data = d.data()
        if (data) {
            const response = {
                pairs: d.data().preferencePairs
            }
          res.status(200).send(response)
        } else {
            res.status(200).send({isUser: false})
        }
    }
}

export const getTechnicalPairs = async (req, res, next) => {  
    try {
        const evalRef = db.collection('evaluation').doc(req.query.split)
        const d = await evalRef.get()
        if (!d.exists) {
            res.status(400).send({success: false, message: 'Split does not exist'})
        } else {
            const data = d.data()
            if (data) {
                const response = {
                    pairs: d.data().pairs,
                }
            res.status(200).send(response)
            } else {
                res.status(400).send({success: false, message: 'Split does not exist'})
            }
        }
    } catch(error) {
        console.error(error)
        res.status(400).send({'success': false})
    }
}

export const setAnnotations = async (req, res, next) => {  
    const data = req.body
    console.log(data)
    try {
        const docRef = db.collection('evaluation').doc(data.split)
        const surveyResponse = await docRef.get();
        if (!surveyResponse.exists) {
            res.status(400).send({'success': false, 'message': 'Split does not exist'})
        } else {
            let annotations = surveyResponse.data().annotations 
            let newAnnotations = {...annotations, [data.uid]: data.annotations}
            let updatedData = {annotations: newAnnotations}
            try {
                await docRef.update(updatedData)
                res.status(200).send({'success': true})
            } catch (error) {
                console.error('Error updating document:', error);
                res.status(400).send({'success': false})
            }
        }
    } catch(error) {
        console.error(error)
        res.status(400).send({'success': false})
    }
}
