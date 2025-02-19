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