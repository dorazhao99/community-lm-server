import { db } from '../firebase.js';
import Community from '../models/modulesCommunity.js';
import { getGithubToken, checkRepo, interpretMarkdown, checkUIDExists } from '../utils.js'
import config from '../config.js';
import axios from 'axios'; 
import Module from '../models/modulesModel.js';


//get all communities

export const getCommunities = async (req, res, next) => {
    const commsRef = db.collection('communities');
    const comms = await commsRef.get();
    const commsArray = [];

    for (const commDoc of comms.docs) {
        const commData = commDoc.data();

        // // Fetch authors
        // const modulePromises = moduleRefs.map(ref => ref.get());
        // const moduleSnaps = await Promise.all(modulePromises);

        // const modules = moduleSnaps.map(moduleSnap => ({
        //     id: moduleSnap.id,
        //     ...moduleSnap.data()
        // }));

        const c = new Community(
            commDoc.id,
            commData.name, 
            commData.description, 
            commData.moduleNames
        );
        commsArray.push(c);
    }

    res.status(200).send(commsArray);
};

export const getCommunity = async (req, res, next) => {
    const uid = req.query.user
    const userData = await getGithubToken(db, uid)
    
    let BEARER_TOKEN =  config.devToken
    if (userData.token) {
      BEARER_TOKEN = userData.token
    }
  
    const communityRef = db.collection('communities').doc(req.query.id)
    const d = await communityRef.get();
    
    if (!d.exists) {
        es.status(200).send({'success': false, 'error': 'Sorry, this module no longer exists.'})
    } else {
        const commData = d.data()
        commData['id'] = req.query.id
        const moduleRefs = commData.modules;
        const modulePromises = moduleRefs.map(ref => ref.get());
        const moduleSnaps = await Promise.all(modulePromises);

        const modules = moduleSnaps.map(moduleSnap => ({
            id: moduleSnap.id,
            ...moduleSnap.data()
        }));

        const requests = []
        const headers = {
            'Accept': 'application/vnd.github.raw+json',
            'Authorization': `Bearer ${BEARER_TOKEN}`
        }
        
        const moduleIds = []
        modules.forEach(mod =>{
            moduleIds.push(mod.id)
            const repoInfo = checkRepo(mod.gh_page); 
            requests.push(axios.get(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo_name}/contents/${repoInfo.fileName}`, {headers: headers}))
        })

        let isPrivate = false
        axios.all(requests)
        .then(data => {
            data.forEach(response => {
                if (response.status != 200) {
                    isPrivate = true
                }
            })
            commData['moduleIds'] = moduleIds
            console.log(commData)
            if (isPrivate) {
                res.status(200).send({'success': false, 'error': 'This is a private module. Only users who have authenticated via Github and have access to the module can access this information.'})
            } else {
                res.status(200).send({'success': true, data: commData})
            }
        })
        .catch(
            error => {
                console.log(error)
                res.status(200).send({'success': false, 'error': 'Module was not found. Please try again later.'})
            }
        )
    }
  }

  export const selectCommunity = async (req, res, next) => {
    // check auth token here
    const body = req.body;
    const uid = body?.uid
    const moduleIds = body?.modules
    const cid = body?.id
    const userRef = db.collection('users').doc(uid)
  
    // Check if user exists
    const user= await userRef.get()
    if (!user.exists) {
      res.status(400).send({error: 'User does not exist'})
    }  
    const userData = user.data()
    const savedModules = [...userData.modules]
    const checked = {...userData.checked}
  
    const querySnapshot = await db.collection("community").doc(cid).get();
    if (querySnapshot.empty && response.data) {
      res.status(200).send({success: false, message: 'Community does not exist'})
    } 
    else {
      moduleIds.forEach(moduleId => {
        const isFound = checkUIDExists(savedModules, moduleId)
        console.log('found', isFound)
        if (!isFound) {
          savedModules.push(moduleId)
        }
        checked[moduleId] = true 
      })
      await userRef.update({modules: savedModules, checked: checked})
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
      res.status(200).send({success: true, message: 'Module added.', checked: checked, modules: modules})
    }
  };