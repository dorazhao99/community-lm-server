import { db } from '../firebase.js';
import { documentId} from "firebase/firestore";
import axios from 'axios';
import config from '../config.js';
import { getGithubToken, checkRepo, interpretMarkdown, checkUIDExists } from '../utils.js'

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
        "1VMddeOE60QJ5KxNxcG6Ia8adIo2",
        "fIZvPmUwfwPH9ig4ARWw8DrfJZ73",
        "rfYescuyLIS3nhQllfqijlEadxK2"
    ],
    3: [
        "hrgluvyrEzNsuDmfCJnqTHIK3Pl1",
        "6zXrp29XltaDzf7OsTFw7vCXWQW2",
        "AllIIbkhDpeUodrbtOEhUFy9HuU2",
        "EB3pO1LAMHZd4CIIn4QQR3U7eum1",
        "IIPsDDKbBubsOeBxuKwsDQQau803",
        "mIwkBIkNmdQDE79PBlK9C9mL0qv2",
        "NCc5bOCTRLQiMpiDLDILQZkjrTh2",
        "XKnTUE84CgWUdfErd0svomjLdDJ2",
        "iC6cOtg3B4MhTjlm2pZOZ91jX2l1",
        "37XVpoYsPVZmDltph5kmvuFhI6N2",
        "IUFiws6cjGSJ5CUwDNUSctLUkHV2",
        "ovY0B8siipVAfFBH99mVFqdqJl13",
        "PhTiPSQz9nbSQZNvmRUf3SiOWwg1",
        "B1aZRMor9IPiuzI9KYz1SlPF6303",
        "zPyzb9aD5paGATeOjnC5tLmBbFc2",
        "5zJiNn3Me1bgebADIEmen7vol9L2",
        "gTABrRJsJnOyU1em3G0z7sUaWrW2",
        "IEWWlGBBtyQUMzVYc2gaQV4rrDB2",
        "6hcVicjRYoR7DXtKrOWpHQKipTA2"
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

export const getUsers = async(req, res, next) => {
    const idx = req.query.idx
    const userRef = db.collection('users')
    const userResults = await userRef.where("__name__", 'in', newUsers[idx]).get()
    const users = {}
    userResults.forEach(user => {
        users[user.id] = {
            checked: user.data().checked, 
            modules: user.data().modules,
            numMessages: user.data().numMessages
        }
    })
    console.log(users)
    res.status(200).send(users)
}

export const getKnowledge = async(req, res, next) => {
  try {
    const data = req.body
    const uid = req.body.user
    const userData = await getGithubToken(db, uid)

    let updatedKnowledge = {}
    let BEARER_TOKEN =  config.devToken
    if (userData.token) {
      BEARER_TOKEN = userData.token
    }

    const docRef = db.collection('users').doc(uid)
    const user = await docRef.get();
    if (user.exists) {
      try {
        const d = {checked: data.checked}
        await docRef.update(d)
      } catch(error) {
        console.log(error)
      }
    }

    const requests = []
    const ghInfo = []
    const googleInfo = []
    const googleRequests = []

    Object.entries(data.checked).forEach((idx) => {
      if (idx[1]) {
          const mod = data.modules.find(item => item.id === idx[0]);
          if (mod) {
            console.log('Mod', mod)
            if (mod?.source === 'google') {
              googleRequests.push(docs.documents.get({ auth: client, documentId: mod.documentId}))
              googleInfo.push({name: mod.name, link: mod.doc_page, uid: idx[0]})
            } 
            else {
              const params = {
                  owner: mod.owner,
                  repo: mod.repo_name,
                  path: mod.link
              }
              console.log(params, BEARER_TOKEN, `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`)
              requests.push(axios.get(`https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`, {
                  headers: {
                      'Accept': 'application/vnd.github.raw+json',
                      'Authorization': `Bearer ${BEARER_TOKEN}`
                  }
              }))
              const gh_page = mod.gh_page ? mod.gh_page : ""
              ghInfo.push({uid: idx[0], link: gh_page, name: mod.name})
            }
          }
      }
    })
    
    axios.all(requests)
    .then(axios.spread((...responses) => {
        responses.forEach((response, index) => {
            if (response.data) {
              updatedKnowledge[ghInfo[index].uid] = {knowledge: response.data, link: ghInfo[index].link, name: ghInfo[index].name}
            }
        });

        Promise.allSettled(googleRequests)
        .then(googleResults => {
          googleResults.forEach((response, index) => {
            if (response.status) {
              const data = response?.value?.data
              const body = data?.body 
              const knowledge = []
              if (body) {
          
                body?.content.forEach(chunk => {
                  const paragraph = chunk.paragraph
                  const style = paragraph?.paragraphStyle
                  const [addStyle, styledMark] = styleToMark(style)
                  if (addStyle) {
                    knowledge.push(styledMark)
                  }
                  paragraph?.elements.forEach(element => {
                    const content = element?.textRun?.content
                    if (content) {
                      knowledge.push(removeControlCharacters(content))
                    }
                  })
                })
                const formattedKnowledge = knowledge.join(" ")
                updatedKnowledge[googleInfo[index].uid] = {knowledge: formattedKnowledge, link: googleInfo[index].link, name: googleInfo[index].name}
              }
            }
          })
          console.log(updatedKnowledge)
          res.status(200).send(updatedKnowledge);
        })
    }))
  } catch(error) {
    console.log(error)
    res.status(400).send(error)
  }
  
}

export const getModuleKnowledge = async(req, res, next) => {
    try {
        const moduleId = req.query.modId
        const uid = req.body.uid
        const userData = await getGithubToken(db, uid)
        let BEARER_TOKEN =  config.devToken
        if (userData.token) {
            BEARER_TOKEN = userData.token
        }
    
        const moduleRef = db.collection('modules').doc(moduleId)
        const m = await moduleRef.get();
        const mod = m.data();
        
        let formattedKnowledge = ""
        if (mod?.source === 'google') {
            // google call
            const response = await docs.documents.get({ auth: client, documentId: mod.documentId})
            if (response.status) {
                const data = response?.value?.data
                const body = data?.body 
                const knowledge = []
                if (body) {
                    body?.content.forEach(chunk => {
                        const paragraph = chunk.paragraph
                        const style = paragraph?.paragraphStyle
                        const [addStyle, styledMark] = styleToMark(style)
                        if (addStyle) {
                        knowledge.push(styledMark)
                        }
                        paragraph?.elements.forEach(element => {
                        const content = element?.textRun?.content
                        if (content) {
                            knowledge.push(removeControlCharacters(content))
                        }
                        })
                    })
                    formattedKnowledge = knowledge.join(" ")
                }
            }
        } else {
            const params = {
                owner: mod.owner,
                repo: mod.repo_name,
                path: mod.link
            }
            console.log(params)
            // axios call
            const response = await axios.get(`https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`, {
                headers: {
                    'Accept': 'application/vnd.github.raw+json',
                    'Authorization': `Bearer ${BEARER_TOKEN}`
                }
            })
            if (response.data) {
                formattedKnowledge = response.data
            }
        }
        res.status(200).send({data: formattedKnowledge})
    } 
    catch(error) {
        console.log(error)
        res.status(200).send({data: error})
    }
}

export const createPairs = async(req, res, next) => {
     // check auth token here
     const data = req.body
     console.log(data)
     try {
        if (data.uid) {
            const docRef = db.collection('users').doc(data.uid)
            const user = await docRef.get();
            if (user.exists) {
                const d = {
                    preferencePairs: JSON.parse(data.preferencePairs)
                }
                console.log(d)
                await docRef.update(d)
                res.status(200).send({data: d})
            } else {
                console.log('User not found')
                res.status(400).send({data: 'User not found'})
            }
        } else {
            console.log('User not found')
            res.status(400).send({data: 'User not found'})
        }
    } catch(error) {
        console.log(error)
        res.status(400).send({data: error})
    }
}
