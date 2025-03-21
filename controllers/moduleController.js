import { firebase, db } from '../firebase.js';
import { docs, docAuth, client } from '../docs.js'
import Module from '../models/modulesModel.js';
import axios from 'axios'; 
import { getGithubToken, checkRepo, interpretMarkdown, checkUIDExists } from '../utils.js'
import config from '../config.js';

//get all modules

export const getModules = async (req, res, next) => {
    const uid = req.query.user
    const modulesRef = db.collection('modules');
    const modules = await modulesRef.get();
    const modulesArray = [];
    const urls = [];
    const privModules = [];


    if (modules.empty) {
      res.status(400).send('No Products found');
    } else {
      modules.forEach((doc) => {
        const queries = doc.data().queries ? doc.data().queries : []

        const m = {id: doc.id, queries: queries, ...doc.data()}
        modulesArray.push(m)
      });
      res.status(200).send(modulesArray);
  }
};

export const getGalleryModules = async (req, res, next) => {
  const modulesRef = db.collection('modules');
  const modules = await modulesRef.where("isGallery", "==", true).get();
  const modulesArray = [];

  if (modules.empty) {
    res.status(400).send('No Products found');
  } else {
    modules.forEach((doc) => {
      const m = {id: doc.id, ...doc.data()}
      modulesArray.push(m)
    });
    res.status(200).send(modulesArray);
}
};

export const getUserModules = async (req, res, next) => {
  try {
    const uid = req.query.user
    if (uid) {
      const docRef = db.collection('users').doc(uid)
      const user = await docRef.get();
      const savedModules = user.data().modules; 
      const checked = user.data().checked;
      const modulesRef = db.collection('modules');
    
      const modules = []
      const modulePromises = savedModules.map(mod => modulesRef.doc(mod).get());
      const moduleSnaps = await Promise.all(modulePromises);
  
      moduleSnaps.forEach((doc) => {
        if (doc.data()) {
          const description = doc.data().description ? doc.data().description : ""
          const m = {id: doc.id, ...doc.data()}
          m.description = description
          modules.push(m)
        }
      });
    
     res.status(200).send({modules: modules, checked: checked});
    } else {
      res.status(400).send('No user')
    } 
  } catch (error) {
    console.error(error)
    res.status(400).send(error.message);
  }
};

export const getUserModulesOld = async (req, res, next) => {
  try {
    const uid = req.query.user

    const docRef = db.collection('users').doc(uid)
    const user = await docRef.get();
    const savedModules = user.data().modules; 
    const checked = user.data().checked;
    const modulesRef = db.collection('modules');
    // const q = query(collection(db, 'modules'), where(documentId(), 'in', savedModules));
  
    const modules = []
    const modulePromises = savedModules.map(mod => modulesRef.doc(mod).get());
    const moduleSnaps = await Promise.all(modulePromises);

    moduleSnaps.forEach((doc) => {
      if (doc.data()) {
        const description = doc.data().description ? doc.data().description : ""
        const m = {id: doc.id, ...doc.data()}
        m.description = description
        modules.push(m)
      }
    });
  
   res.status(200).send(modules);
    
  } catch (error) {
    console.error(error)
    res.status(400).send(error.message);
  }
};

export const getModule = async (req, res, next) => {
  const uid = req.query.user
  const userData = await getGithubToken(db, uid)
  
  let BEARER_TOKEN =  config.devToken
  if (userData.token) {
    BEARER_TOKEN = userData.token
  }

  const moduleRef = db.collection('modules').doc(req.query.id)
  const d = await moduleRef.get();
  
  if (!d.exists) {
    res.status(200).send({'success': false, 'error': 'Sorry, this module no longer exists.'})
  } else {
    if (d.data().source && d.data().source === 'google') {
      res.status(200).send({'success': true, data: d.data()})
    } else {
      const repoInfo = checkRepo(d.data().gh_page); 

      axios.get(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo_name}/contents/${repoInfo.fileName}`, {
        headers: {
            'Accept': 'application/vnd.github.raw+json',
            'Authorization': `Bearer ${BEARER_TOKEN}`
          }
      })
      .then(response => {
        console
        if (response.status === 200) {
          res.status(200).send({'success': true, data: d.data()})
        } else (
          res.status(200).send({'success': false, 'error': 'Module was not found. Please try again later.'})
        )
      })
      .catch(error => {
        res.status(200).send({'success': false, 'error': 'This is a private module. Only users who have authenticated via Github and have access to the module can access this information.'})
      })
    }
  }
}

export const addGithubModule = async (req, res, next) => {
  // check auth token here
  const body = req.body;
  const uid = body.uid
  const userRef = db.collection('users').doc(uid)

  // Check if user exists
  const user= await userRef.get()
  if (!user.exists) {
      res.status(400).send({error: 'User does not exist'})
  }  
  const userData = user.data()
  const token = userData.token ? userData.token : config.devToken

  // STEP 1: Check if user has access
  try {
    const link = body.link;
    const repoInfo = checkRepo(link); 
    const response = await axios.get(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo_name}/contents/${repoInfo.fileName}`, {
      headers: {
          'Accept': 'application/vnd.github.raw+json',
          'Authorization': `Bearer ${token}`
        }
    })

    if (response.status === 200) {
      // STEP 2: Check if module is added to database
      const modulesRef = db.collection("modules");
      const querySnapshot = await modulesRef.where("gh_page", "==", link).get();
      let id = ""

      if (querySnapshot.empty && response.data) {
          // STEP 2b: Add module
          let data = response.data
          let info = interpretMarkdown(data)
          if (!info) {
            res.status(200).send({success: false, message: "Repo formatted incorrectly."})
          } else if (!info.name) {
            res.status(200).send({success: false, message: "Module is missing name in Markdown."})
          } else {
            const newModule = {
              gh_page: body.link, 
              link: repoInfo.fileName,
              owner: repoInfo.owner, 
              repo_name: repoInfo.repo_name, 
              name: body.name, 
              slug: info.slug,
              source: 'github',
              description: body?.description,
              pendingReview: body.isGallery ? body.isGallery : false
            };
            
            // Add the document
            await db.collection("modules").add(newModule)
            .then((docRef) => {
                res.status(200).send({success: true, message: 'Module added.', id: docRef.id})
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
          }
      } else {
        res.status(200).send({success: false, message: 'Module already added.'})
        // const moduleId = querySnapshot.docs[0].id
        // const moduleRef = db.collection("modules").doc(moduleId)
        // await moduleRef.update({name: body.name, isGallery: true})
        // const isFound = checkUIDExists(savedModules, moduleId)
        // if (!isFound) {
        //   savedModules.push(querySnapshot.docs[0].id)
        //   await userRef.update({modules: savedModules})
        //   res.status(200).send({success: true, message: 'Module added.', id: moduleId})
        // } else {
        //   res.status(200).send({success: false, message: 'Module already added.', id: moduleId})
        // }
      } 
    } else if (response.status === 403) {
      res.status(200).send({success: false, message: 'You do not have access to this module.'})
    } else {
      res.status(200).send({success: false, message: 'There was an issue adding the module.'})
    }
  }
  catch(error) {
    console.log(error)
    res.status(200).send({success: false, message: error})
  }
};

export const addGoogleModule = async (req, res, next) => {
  // check auth token here
  const body = req.body;
  const uid = body.uid
  const userRef = db.collection('users').doc(uid)

  // Check if user exists
  const user= await userRef.get()
  if (!user.exists) {
      res.status(400).send({success: false, message: 'User does not exist'})
  }  
  const userData = user.data()
  const savedModules = [...userData.modules]

  // STEP 1: Get Document ID
  const link = body?.link 
  if (link) {
    const docId = link.match(/\/d\/([^\/]+)\//)[1];
    console.log(docId)
    if (docId) {
      try {
        const response = await docs.documents.get({ auth: client, documentId: docId})
        // STEP 2: Check to make sure it does not exist
        const modulesRef = db.collection("modules");
        const querySnapshot = await modulesRef.where("documentId", "==", docId).get();
        if (querySnapshot.empty) {
          const newModule = {
            doc_page: link, 
            documentId: docId,
            name: body.name, 
            source: 'google',
            description: body.description ? body.description : "",
            pendingReview: body.isGallery ? body.isGallery : false
          };

          await db.collection("modules").add(newModule)
          .then((docRef) => {
            res.status(200).send({success: true, message: 'Module added.', id: docRef.id})
          })
          .catch((error) => {
            console.log("Error adding document: ", error);
            res.status(400).send({success: false, message: 'Error adding document.'})
          });
        } else {
          res.status(400).send({success: false, message: 'Module has already been added.'})
        }
      } catch(error) {
        console.log(error)
        if (error?.response?.status === 403) {
          res.status(403).send({success: false, message: 'Make sure the Google Doc is publicly viewable.'})
        } else {
          res.status(400).send({success: false, message: `Could not find linked Google Doc.`})
        }
      }
    } else {
      res.status(400).send({success: false, message: `Invalid doc id ${docId}`})
    }
  }
}

export const deleteModule = async (req, res, next) => {
  const body = req.body;
  const uid = body.uid
  if (!body.module) {
    res.status(400).send({error: 'Module not sent'})
  } else {
    const userRef = db.collection('users').doc(uid)
    const user= await userRef.get()
    if (!user.exists) {
      res.status(400).send({error: 'User does not exist'})
    }  

    const module = req.body.module
    const userData = user.data()
    const modules = userData.modules
    let checked = {...userData.checked}
    let newModules;
    if (modules.includes(module)) {
      newModules = modules.filter((m) => m !== module);
      if (checked.module) {
        checked[module] = false
      }
    } else {
      newModules = modules
    }

    userRef.update({modules: newModules, checked: checked})
    .then(response => {
      res.status(200).send({success: true, message: "Module deleted", modules: newModules, checked: checked})
    })
    .catch(error => {
      res.status(200).send({success: false, message: error})
    })
  }
}

export const selectModule = async (req, res, next) => {
  // check auth token here
  const body = req.body;
  const uid = body?.uid
  const moduleId = body?.module 
  const userRef = db.collection('users').doc(uid)

  // Check if user exists
  const user= await userRef.get()
  if (!user.exists) {
    res.status(400).send({error: 'User does not exist'})
  }  
  const userData = user.data()
  const savedModules = [...userData.modules]
  const checked = {...userData.checked}
  const querySnapshot = await db.collection("modules").doc(moduleId).get();

  if (querySnapshot.empty && response.data) {
    res.status(200).send({success: false, message: 'Module does not exist'})
  } 
  else {
    const isFound = checkUIDExists(savedModules, moduleId)
    if (!isFound) {
      savedModules.push(moduleId)
    }
    checked[moduleId] = true 
  
    await userRef.update({modules: savedModules, checked: checked})

    const modulesRef = db.collection('modules');
    const modules = []
    const modulePromises = savedModules.map(mod => modulesRef.doc(mod).get());
    const moduleSnaps = await Promise.all(modulePromises);

    moduleSnaps.forEach((doc) => {
      if (doc.data()) {
        const description = doc.data().description ? doc.data().description : ""
        const m = {id: doc.id, ...doc.data()}
        modules.push(m)
      }
    });
    
    res.status(200).send({success: true, message: 'Module added.', checked: checked, modules: modules})
  }
};

export const readFiles = async(req, res, next) => {
    const data = req.body

    // Get Github API token 
    const uid = data.uid

    const userData = await getGithubToken(db, uid)
    
    // 
    const fileName = data.path.split('.')[0]
    const requests = [
      axios.get(`https://api.github.com/repos/${data.owner}/${data.repo}/contents/${fileName}.md`, {
      headers: {
              'Accept': 'application/vnd.github.raw+json',
              'Authorization': `Bearer ${userData.token}`}}),
      axios.get(`https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.path}`, {
          headers: {
              'Accept': 'application/vnd.github.raw+json',
              'Authorization': `Bearer ${userData.token}`
            }
          }),
    ]
    let files = []
    axios.all(requests)
    .then(axios.spread((...responses) => {
        responses.forEach((response, _) => {
            files.push(response.data)
        });
        res.status(200).send(files)
    }))
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
          res.status(200).send(updatedKnowledge);
        })
    }))
  } catch(error) {
    console.log(error)
    res.status(400).send(error)
  }
  
}

export const getStarterPacks = async  (req, res, next) => {
  const allModuleRef = db.collection('all_modules').doc(req.query.id)
  const d = await allModuleRef.get();
  
  if (!d.exists) {
    res.status(200).send({'success': false, 'error': 'Sorry, this pack no longer exists.'})
  } else {
    const starterData = d.data()
    const moduleRefs = starterData.modules;
    const modulePromises = moduleRefs.map(ref => ref.module.get());
    const moduleSnaps = await Promise.all(modulePromises);

    let returnInfo = {'modules': {}}
    moduleSnaps.forEach((moduleSnap, idx) => {
      const module = moduleSnap.data()
      const sectionName = moduleRefs[idx].section
      if (!(sectionName in returnInfo['modules'])) {
        returnInfo['modules'][sectionName] = []
      } 
      const data = {
        id: moduleSnap.id, 
        ...module
      }
      returnInfo['modules'][sectionName].push(data)
    });
    
    // modules.forEach(mod =>{
    //     returnInfo.push({id: mod.id, ...mod})
    // })
    returnInfo['title'] = starterData.title 
    returnInfo['description'] = starterData.description
    res.status(200).send({'success': true, data: returnInfo})
    // let isPrivate = false
    // axios.all(requests)
    // .then(data => {
    //     data.forEach(response => {
    //         if (response.status != 200) {
    //             isPrivate = true
    //         }
    //     })
    //     starterData['moduleIds'] = moduleIds
    //     console.log(starterData)
    //     if (isPrivate) {
    //         res.status(200).send({'success': false, 'error': 'This is a private module. Only users who have authenticated via Github and have access to the module can access this information.'})
    //     } else {
    //         res.status(200).send({'success': true, data: starterData})
    //     }
    // })
    // .catch(
    //     error => {
    //         console.log(error)
    //         res.status(200).send({'success': false, 'error': 'Module was not found. Please try again later.'})
    //     }
    // )
  }
}

function styleToMark(style) {
  const styleName = style?.namedStyleType
  if (styleName && styleName.includes('HEADING')) {
    const headingNumber = styleName.split('_').slice(-1)
    const count = parseInt(headingNumber);
    if (isNaN(count)) {
      return [false, null]
    } 
    const heading = "#".repeat(count);
    return [true, heading]
  } else {
    return [false, null]
  }
}

function removeControlCharacters(str) {
  if (str) {
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, '') + '\n';
  } else {
    return str + '\n'
  }
}

export const getGoogleDocs = async (req, res, next) => {
  
  const response = await docs.documents.get({
    auth: client,
    documentId: '1qGh4OjcsT2BDlr6lds6E4gIKzg_nUTsL6RsF97k6lSw',  // Get this from the document URL
  });

  const knowledge = []
  if (response.data) {
    const data = response.data
    const body = data?.body 
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
      const updatedKnowledge = knowledge.join(" ")
      res.status(200).send({updatedKnowledge})
    }
  } else {
    res.status(200).send({knowledge})
  }
}

export const addKnowledge = async(req, res, next) => {
  const data = req.body 
  const token = req.headers?.authorization 
  const modulesRef = db.collection('modules');
  // if module exists
  if (data?.module) {
    const allModuleRef = modulesRef.doc(data.module)
    const module = await allModuleRef.get();
    if (module.exists) {
      if (module.data().source === 'google') {
        const documentId = module.data().documentId
        try {
          const document = await docs.documents.get({auth: client, documentId: documentId });
          const endIndex = document.data.body.content[document.data.body.content.length - 1].endIndex - 1;
          const response = await docs.documents.batchUpdate({
            auth: client,
            documentId: documentId,
            requestBody: {
              requests: [
                {
                  insertText: {
                    location: {
                      index: endIndex,
                    },
                    text: '\n' + data.content,  
                  },
                },
              ],
            },
          });
          if (response) {
            console.log(response)
            res.status(200).send({success: true, link: module.data().doc_page})
          }
        } catch(error) {
          const code = error?.code ? error.code : 400
          let message = 'Sorry, there was a problem updating the document.'
          if (code === 403) {
            message = "You do not have access to this document. Ensure the document is publicly editable."
          }
          res.status(code).send({success: false, error: message})
        }

      } else {
        /* TODO */
        res.status(501).send({success: false, error: "Clipping to Github documents not available."})
      }
      
    } else {
      res.status(404).send({success: false, error: "Module does not exist"})
    }

  } else {
    res.status(400).send({success: false, error: "Did not send module"})
  }
  


}

