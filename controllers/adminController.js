import { db } from '../firebase.js';

const newUsers = {
    0: [
        "P815MKeL6ghTrQzlsRRV6koSUd93",
        "hRNZfNVFCybQcbDOdgLCbBu1C9V2",
        "FTXWqLC9EshF30jAE6sbvdIPHku1",
        "YsvkFT8Gr5O32SUlseVOyMw5DRv1",
        "W5eQoSTmglTf8kTINxZioAa5rhs1",
        "gfV1bfhMcNO8IhliFvKt8YrhT203",
        "ypWjSYCvLTNuvvNWsTZB6ydwsI82",
        "Ixs8CQJ9qJTe0wvcHI2i32hu1wT2", 
        "R9TKMDVskNdQhVNW9LOXNcy4cqz1", 
        "HyhBMBlcWPRQ5YHD2QdbHye1U0t2",
        "th0XhYftU9f9NW0jDIN9S5bXKW82",
        "oW43f6YmNhdNCHe8mWLyC0HyPn73", 
        "ta6kBpbembWXdPyPgHXYDVNlXHl2",
        "RrbAafCCANeXegapxCBIaTEjIfA3", 
        "W8HB2frjanZ6PnvbSRzRLE5bcV02", 
        "2mkR44Dt6gUSrlpeWYq26w1viw13",
        "uUrHWORY1oYBZtO4gMgGMBomTwX2",
        "Z6ccWoAXJSZlJdRRWWsLHsTdzk72",
        "CGEIk460vyfPJogOf2MhSfOWlSm2",
        "Thd09TOcsbXrmzOsjIu3g4PMS513",
        "0CSy6aIQHWXWkqjIDVeH0ffvEO22", 
        "YhbFIztAoCM4hQRUzmeODEgqnBx2",
        "rEtQx01UW8Mpe2fmxtVtVINiFF73",
        "QXBunO06OUSNI0fWpgFzWLyg8PE2",
        "a847rohAFqVrftL0Sr9Ht2UREKX2",
        "9RcnYRIw3HSL4j9VPJMFHdSGvdD3",
        "naIi5WcTqYVpy9dFgHwXlclO4FA2",
        "9RcnYRIw3HSL4j9VPJMFHdSGvdD3"],
    1: [
        "QXBunO06OUSNI0fWpgFzWLyg8PE2",
        "rEtQx01UW8Mpe2fmxtVtVINiFF73",
        "sM75P6rYI2a2YLB8Xg77N8Lhfv23",
        "GvmLkrdGdlMSShnu8WAbG7dqrPp1",
        "oPC1sqfW3Ca3rzoFBdkCxVbBlG92",
        "j7wQG3mAM6MIOE2p406zrhZwKpn1",
        "SL70ranCHIhD1Y7cG6qjFeu4ays2",
        "cG4lk6ZtUwTiX4j4opvuZleR1dp2",
        "GjAZv6SsMVM2SEKVxJGdii8o4MS2",
        "xnGYtdP91sT4px04qCN1xqCOt3P2"
    ],
}

export const getMessage = async(req, res, next) => {
    const idx = req.query.idx
    const moduleOnly = req.query.mo == '1' ? true : false
    const docRef = db.collection('messages')
    const allDocs = []
    const results = await docRef.where("uid", "in", newUsers[idx]).get()
    const allMessages = {}
    results.forEach((doc) => {
        const modules = doc.data().modules
        const changedModule = []
        modules.forEach(module => {
            if (module !== null) {
                if (module.knowledge) {
                    changedModule.push(module.name)
                } else {
                    changedModule.push(module)
                }
            }
        })
        if (doc.data().uid in allMessages) {
            allMessages[doc.data().uid] += 1
        } else {
            allMessages[doc.data().uid] = 1
        }
        if (moduleOnly && changedModule.length > 0) {
            allDocs.push({
                'id': doc.id, 
                'conversationId': doc.data().conversationId,
                'message': doc.data().message,
                'modules': changedModule,
                'uid': doc.data().uid
            })
        } else if (!moduleOnly) {
            allDocs.push({
                'id': doc.id, 
                'conversationId': doc.data().conversationId,
                'message': doc.data().message,
                'modules': changedModule,
                'uid': doc.data().uid
            })
        }
    })
    let count = 0 
    const uid2activated = {}
   
    allDocs.forEach(doc => {
        if (doc.modules.length > 0) {
            count += 1
            if (doc.uid in uid2activated) {
                uid2activated[doc.uid] += 1
            } else {
                uid2activated[doc.uid] = 1
            }
        }
    })
    console.log(allMessages)
    console.log(uid2activated)
    console.log(newUsers[idx].length, allDocs.length, count)
    res.status(200).send(allDocs)
}