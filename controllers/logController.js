import { db } from '../firebase.js';
import axios from 'axios';
import { logger } from '../libs/logger.js'
import config from '../config.js';
import { v4 as uuidv4 } from 'uuid';

export const createLog = async (req, res, next) => {
    const data = req.body
    if (data.uid && data.action) {
        const d = {
            uid: data.uid, 
            action: data.action, 
            time: Date.now()
        }

        const logId = uuidv4()
        await db.collection('logs').doc(logId).set(d)
        .then(_ => {
            res.status(200).send({'success': true})
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({'success': false})
        })
    } else {
        res.status(400).send({'success': false})
    }
}
