import { db } from '../firebase.js';
import { documentId} from "firebase/firestore";
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
        "xnGYtdP91sT4px04qCN1xqCOt3P2",
        "mpvgs3731PQ7K753xyRfV86QxSn2",
        "bJxnvmuoIHRa09DaNDB8cx42kDJ3",
        "QqsvyCnFU8aMuykyegvYhRwjp3E3",
        "WbJv2gYgYyad3A2mzgCUEN3As5A3",
        "RqbH39IR8uOnasHTTUB2etv89bc2",
        "RcENLJxFKjUMC4WMwciSWrBcnhx1",
        "mRAENJNnslZ5LfZWy5VJV18r41v1",
        "cDI4BkplKCgLyqtnmPy3lTPbDmt1",
        "ao0hsz88EjdyzOtY83c8gdubvCN2",
        "2hrJA8Aoadg4tB4r6aUyP3N7b352",
        "OM3Erx0bWec5d2vFM6uURciZW392",
        "EkRZ00VFbhP37nFLwgLWwRBpVcn1"
    ],
    2: [
        "BrpOOkBoJObwysa28i4TV56PIvm2",
        "oa1muxW74xZi9UvgJeFaPHww3XF3",
        "y8QEiLjd7yTY9BK62hb39SOe2DS2",
        "lp1IDyR6syV04FqyxgiyL3Hm0f43",
        "Mx7C4NuzGjgX1bzjlByDeyGyrtg2",
        "mwxwdQrpTtXXWru40qbCGoORamJ2",
        "it4pN0Z7jeSHkYoBD4SsfRDfT1K3",
        "Qx4dF9YfHhUEEKGEL0Yd0WOQnQt1",
        "GodQp8ZQpJaHvp13EvaWppO1Mtx2",
        "ue4UKe6wECcgIULjYDE9MPjTRBL2",
        "khd6yjwvzkQ4s4UV6ypmgST22k53",
        "ssPSz2wM2MZUzMy7VXyODH4zAyl2",
        "CXIa2iZMjagnhCIWgQWksPvPfEe2",
        "sGtNzSQOkydg0T20YSrVN4QrEZC3",
        "d4lVYEvVYaSEiA7YDXkq4ucb9Dp1",
        "RsXdXCwS5BeyC4TwtEvCVoVRp0j2",
        "9pEs1gMCaIhgcvfWtgrGwjI4h7u1",
        "yZqDFRDq0tcmnziC5Su9fX9Qdgj2",
        "CxJ6e7TRhDfwrAY812QEm6lKsYg2",
        "rdjodyIAoCdakbOL5VWQl2kVhVA2",
        "dIZ4POhWnONHJNfZsg6X5YRw4Ch2",
        "uDfA6jwu1YQS7dWBCK3QuIX73k83",
        "964mzvVP0vdEPPdO1qrSbqDT72m1",
        "Kyek1McsRTTUpU7S7Y1SAsUk92r2",
        "09xj9V5SZsbaD4Nnuxe5207brqx1",
        "1VMddeOE60QJ5KxNxcG6Ia8adIo2"
    ]
}

export const getMessage = async(req, res, next) => {
    const idx = req.query.idx
    const moduleOnly = req.query.mo == '1' ? true : false
    const docRef = db.collection('messages')
    const userRef = db.collection('users')
    const allDocs = []
    const results = await docRef.where("uid", "in", newUsers[idx]).get()
    // const userResults = await userRef.where("uid", "in", newUsers[idx]).get()
    // const userRef = query(db.collection('users'), where(documentId(), 'in', newUsers[idx]));
    const userResults = await userRef.where("__name__", 'in', newUsers[idx]).get()

    const users = {}
    userResults.forEach(user => {

        users[user.id] = user.data().checked
    })

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
            const uid = doc.data().uid
            allDocs.push({
                'id': doc.id, 
                'conversationId': doc.data().conversationId,
                'message': doc.data().message,
                'modules': changedModule,
                'uid': uid,
                'checked': users[uid],
                'time': doc.data().time
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


// export const getMessage = async(req, res, next) => {
//     const docRef = db.collection('messages')
//     const userRef = db.collection('users')
//     const allDocs = []
//     const results = await docRef.where("uid", "in", newUsers).get()
//     const userResults = await userRef.where("uid", "in", newUsers).get()
//     const users = {}
//     userResults.forEach(user => {
//         users[user.id] = user.data().checked
//     })
//     const allMessages = {}
//     results.forEach((doc) => {
//         const modules = doc.data().modules
//         const uid = doc.data().uid
//         const changedModule = []
//         modules.forEach(module => {
//             if (module !== null) {
//                 if (module.knowledge) {
//                     changedModule.push(module.name)
//                 } else {
//                     changedModule.push(module)
//                 }
//             }
//         })
//         if (doc.data().uid in allMessages) {
//             allMessages[doc.data().uid] += 1
//         } else {
//             allMessages[doc.data().uid] = 1
//         }
//         allDocs.push({
//             'id': doc.id, 
//             'modules': changedModule,
//             'uid': doc.data().uid,
//             'checked': users[uid]
//         })
//     })
//     let count = 0 
//     const uid2activated = {}
   
//     allDocs.forEach(doc => {
//         if (doc.modules.length > 0) {
//             count += 1
//             if (doc.uid in uid2activated) {
//                 uid2activated[doc.uid] += 1
//             } else {
//                 uid2activated[doc.uid] = 1
//             }
//         }
//     })
//     console.log(allMessages)
//     console.log(uid2activated)
//     console.log(newUsers.length, allDocs.length, count)
//     res.status(200).send(allDocs)
// }