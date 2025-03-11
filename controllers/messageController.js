import { db } from '../firebase.js';


export const storeMessage = async (req, res, next) => {
    const data = req.body
    if (data.uid && data.messageId) {
        const savedModules = []

        if (Array.isArray(data.modules)) {
            data.modules.forEach(module => {
                if (module !== null) {
                    if (module?.name) {
                        savedModules.push(module.name)
                    } else {
                        savedModules.push(module)
                    }
                }
            })
        } else {
            Object.keys(data.modules).forEach(m => {
                let module = data.modules[m]
                if (module !== null) {
                    if (module?.name) {
                        savedModules.push(module.name)
                    } else {
                        savedModules.push(module)
                    }
                }
            })
        }
        let message; 
        try {
            message = (data.message && savedModules.length > 0) ? data.message : ""
        } 
        catch {
            message = ""
        }
        
        const d = {
            message: message,
            conversationId: data.conversationId,
            messageId: data.messageId,
            uid: data.uid, 
            modules: savedModules,
            provider: data.provider,
            time: Date.now()
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
