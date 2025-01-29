import { firebase, db } from '../firebase.js';
import Module from '../models/modulesModel.js';
import axios from 'axios'; 
import { getGithubToken, checkRepo, interpretMarkdown, checkUIDExists } from '../utils.js'
import config from '../config.js';

//get all modules

export const getModules = async (req, res, next) => {
    console.log('Params', req.query)
    const uid = req.query.user
    const modulesRef = db.collection('modules');
    const modules = await modulesRef.get();
    const modulesArray = [];
    const urls = [];
    const privModules = [];
    const userData = await getGithubToken(db, uid)
    const token = userData?.token
    const user = userData?.userName

    if (modules.empty) {
      res.status(400).send('No Products found');
    } else {
      modules.forEach((doc) => {
        const m = new Module(
          doc.id,
          doc.data().name, 
          doc.data().description, 
          doc.data().link,
          doc.data().gh_page,
          doc.data().owner, 
          doc.data().repo_name
        );
        modulesArray.push(m)
        // if (doc.data().access <= 2) {
        //   modulesArray.push(m)
        // } else if (token && user) {
        //   urls.push(`https://api.github.com/repos/${doc.data().owner}/${doc.data().repo_name}/collaborators/${user}`)
        //   privModules.push(m)
        // }
      });
      res.status(200).send(modulesArray);
  //     const requests = urls.map(url => 
  //       axios.get(url,
  //         {
  //           headers: {
  //             'Authorization': `Bearer ${token}`
  //           }
  //         }
  //       )
  //     );

  //     await axios.all(requests)
  //     .then(axios.spread((...responses) => {
  //       responses.forEach((response, idx) => {
  //           if (response.status === 204) {
  //             modulesArray.push(privModules[idx])
  //           }
  //       });
  //     }))
  //     .catch(error => {
  //       // Handle errors
  //       console.error(error); 
  //   });

  //     res.status(200).send(modulesArray);
  //   }
  // } catch (error) {
  //   res.status(400).send(error.message);
  // }
}
};

export const getUserModules = async (req, res, next) => {
  try {
    console.log('Params', req.query)
    const uid = req.query.user

    const docRef = db.collection('users').doc(uid)
    const user = await docRef.get();
    const savedModules = user.data().modules; 
    console.log(user.data())
    const modulesRef = db.collection('modules');
    // const q = query(collection(db, 'modules'), where(documentId(), 'in', savedModules));
  
    const modules = []
    const modulePromises = savedModules.map(mod => modulesRef.doc(mod).get());
    const moduleSnaps = await Promise.all(modulePromises);

    moduleSnaps.forEach((doc) => {
      console.log('Doc', doc.data())
      if (doc.data()) {
        const description = doc.data().description ? doc.data().description : ""
        const m = new Module(
          doc.id,
          doc.data().name, 
          description, 
          doc.data().link,
          doc.data().gh_page,
          doc.data().owner, 
          doc.data().repo_name
        );
        modules.push(m)
      }
    });
  
   console.log(modules)
   res.status(200).send(modules);
    
  } catch (error) {
    console.error(error)
    res.status(400).send(error.message);
  }
};

export const getModule = async (req, res, next) => {
  console.log('Params', req.query)

  const moduleRef = db.collection('modules').doc(req.query.id)
  const d = await moduleRef.get();
  console.log(d)
  if (!d.exists) {
    res.status(400).send('No doc')
  } else {
    res.status(200).send(d.data())
  }
}

export const addModule = async (req, res, next) => {
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
  const savedModules = [...userData.modules]




  // STEP 1: Check if user has access
  const link = body.llmLink;
  const repoInfo = checkRepo(link); 
  console.log('Repo Info', repoInfo, `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo_name}/contents/${repoInfo.fileName}`)
  const response = await axios.get(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo_name}/contents/${repoInfo.fileName}`, {
    headers: {
        'Accept': 'application/vnd.github.raw+json',
        'Authorization': `Bearer ${userData.token}`
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
        console.log('Info', info)
        if (!info.name) {
          res.status(200).send({success: false, message: "Module is missing name in Markdown."})
        } else {
          const newModule = {
            gh_page: body.llmLink, 
            link: repoInfo.fileName,
            owner: repoInfo.owner, 
            repo_name: repoInfo.repo_name, 
            name: info.name, 
            slug: info.slug,
            description: info.description
          };
          
          // Add the document
          await db.collection("modules").add(newModule)
          .then((docRef) => {
              id = docRef.id
              console.log("Document written with ID: ", docRef.id);
              savedModules.push(docRef.id)
              userRef.update({modules: savedModules}).then(() => {
                res.status(200).send({success: true, message: 'Module added.'})
              })
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
        }
    } else {
      const moduleId = querySnapshot.docs[0].id
      const isFound = checkUIDExists(savedModules, moduleId)
      if (!isFound) {
        savedModules.push(querySnapshot.docs[0].id)
        await userRef.update({modules: savedModules})
        res.status(200).send({success: true, message: 'Module added.'})
      } else {
        res.status(200).send({success: false, message: 'Module already added.'})
      }
    } 
  } else if (response.status === 403) {
    res.status(200).send({success: false, message: 'You do not have access to this module.'})
  } else {
    res.status(200).send({success: false, message: 'There was an issue adding the module.'})
  }
};

export const readFiles = async(req, res, next) => {
    const data = req.body
    console.log('data', data)

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
    const requests = []
    const info = []
    const data = req.body
    const uid = req.body.user
    const userData = await getGithubToken(db, uid)
    const BEARER_TOKEN = userData?.token

    const docRef = db.collection('users').doc(uid)
    const user = await docRef.get();
    console.log('User', user)
    if (user.exists) {
      try {
        const d = {checked: data.checked}
        await docRef.update(d)
      } catch(error) {
        console.log(error)
      }
    }

    Object.entries(data.checked).forEach((idx) => {
      if (idx[1]) {
          const mod = data.modules.find(item => item.id === idx[0]);
          if (mod) {
            console.log('Mod', mod)
              const params = {
                  owner: mod.owner,
                  repo: mod.repo,
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
              info.push({uid: idx[0], link: gh_page, name: mod.name})
          }
      }
    })
    let updatedKnowledge = {}
    axios.all(requests)
    .then(axios.spread((...responses) => {
        responses.forEach((response, index) => {
            if (response.data) {
              updatedKnowledge[info[index].uid] = {knowledge: response.data, link: info[index].link, name: info[index].name}
            }
        });
        console.log('Updated knowledge', updatedKnowledge)
        res.status(200).send(updatedKnowledge);
    }))
  } catch(error) {
    console.log(error)
    res.status(400).send(error)
  }
  
}
