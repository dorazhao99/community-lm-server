import { firebase, db } from '../firebase.js';
import Module from '../models/modulesModel.js';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import axios from 'axios'; 
import { getGithubToken, checkRepo } from '../utils.js'
import config from '../config.js';

//get all modules

export const getModules = async (req, res, next) => {
  try {
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
          doc.data().access,
          doc.data().link,
          doc.data().gh_page,
          doc.data().owner, 
          doc.data().repo_name
        );
        if (doc.data().access <= 2) {
          modulesArray.push(m)
        } else if (token && user) {
          urls.push(`https://api.github.com/repos/${doc.data().owner}/${doc.data().repo_name}/collaborators/${user}`)
          privModules.push(m)
        }
      });
      
      const requests = urls.map(url => 
        axios.get(url,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
      );

      await axios.all(requests)
      .then(axios.spread((...responses) => {
        responses.forEach((response, idx) => {
            if (response.status === 204) {
              modulesArray.push(privModules[idx])
            }
        });
      }))
      .catch(error => {
        // Handle errors
        console.error(error); 
    });

      res.status(200).send(modulesArray);
    }
  } catch (error) {
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

export const createModule = async (req, res, next) => {
  // check auth token here
  const data = req.body;
  const uid = data.user?.uid
  console.log('Data User', uid)
  const userData = await getGithubToken(db, uid)
  // STEP 1: Check if user is owner
  const repo = data.repo; 
  const link = data.llmLink;
  const repoInfo = checkRepo(repo); 
  console.log('Repo Info', repoInfo, `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo_name}/contents/${link}`, userData)
  const response = await axios.get(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo_name}/contents/${link}`, {
    headers: {
        'Accept': 'application/vnd.github.raw+json',
        'Authorization': `Bearer ${userData.token}`
      }
  })
  console.log('Response', response)
  if (response.status === 200) {
    // STEP 2: Check if module is already added 
    const modulesRef = db.collection("modules");
    const querySnapshot = await modulesRef.where("gh_page", "==", repo).where("link", "==", link).get();
    console.log('Query snapshot', querySnapshot, querySnapshot.empty)
    if (querySnapshot.empty && response.data) {
        // STEP 3: Add module
        let data = response.data
        try {
          data = JSON.parse(data)
        } catch(error) {
          console.log('Error', error)
          data = response.data
        }
        console.log('data', data, Object.keys(data), data.hasOwnProperty('name'), data.hasOwnProperty('knowledge'), data.hasOwnProperty('description'), data.hasOwnProperty('privacy'))
        if (!(data.hasOwnProperty('name') && data.hasOwnProperty('knowledge') && data.hasOwnProperty('description') && data.hasOwnProperty('privacy'))) {
          res.status(200).send({success: false, message: "Module is missing key elements."})
        } else {
          const newModule = {
            gh_page: repo, 
            link: link,
            owner: repoInfo.owner, 
            repo_name: repoInfo.repo_name, 
            privacy: data.privacy,
            name: data.name, 
            description: data.description
          };
          
          // Add the document
          await db.collection("modules").add(newModule)
          .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
              res.status(200).send({success: true, message: newModule})
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
        }
    } 
    else {
      res.status(200).send({success: false, message: 'This module already exists.'})
    }
  } else if (response.status === 403) {
    res.status(200).send({success: false, message: 'You must be a collaborator on the repo to add.'})
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
    const links = []
    const uids = []
    const data = req.body
    const uid = req.body.user
    const userData = await getGithubToken(db, uid)
    const BEARER_TOKEN = userData?.token
    Object.entries(data.checked).forEach((idx) => {
      console.log('index', idx)
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
              links.push(gh_page)
              uids.push(idx[0])
          }
      }
    })
    let updatedKnowledge = {}
    axios.all(requests)
    .then(axios.spread((...responses) => {
        responses.forEach((response, index) => {
            if (response.data) {
              updatedKnowledge[uids[index]] = {knowledge: response.data, link: links[index], name: response.data.name}
            }
        });
        console.log('Updated knowledge', updatedKnowledge)
        res.status(200).send(updatedKnowledge);
    }))
  } catch(error) {
    res.status(400).send(error)
  }
  
}