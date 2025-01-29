import { db } from '../firebase.js';


export const storeMessage = async (req, res, next) => {
    const data = req.body
    if (data.uid && data.messageId) {
        const d = {
            conversationId: data.conversationId,
            messageId: data.messageId,
            uid: data.uid, 
            modules: data.modules,
            provider: data.provider
        }

        try {
            await db.collection('messages').doc(data.messageId).set(d);
                console.log('Document successfully created!');
                res.status(200).send({'success': true})
        }
        catch (error) {
            console.error('Error creating document:', error);
            res.status(200).send({'success': false, 'err': error})
        }
    } else {
        console.error('Missing fields');
        res.status(200).send({'success': false})
    }
}