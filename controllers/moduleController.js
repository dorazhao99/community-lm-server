import { firebase, db } from '../firebase.js';
import Module from '../models/modulesModel.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  initializeFirestore
} from 'firebase/firestore';
import axios from 'axios'; 
import { getGithubToken } from '../utils.js'
import config from '../config.js';

// const BEARER_TOKEN = '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'
// const db = initializeFirestore(firebase, {
//     experimentalForceLongPolling: true, // this line
//     useFetchStreams: false, // and this line
// })

//get all modules

export const getModules = async (req, res, next) => {
  try {
    const BEARER_TOKEN = await getGithubToken(db, config.testing_uid)
    const modules = await getDocs(collection(db, 'modules'));
    const user = 'dorazhao99'
    const modulesArray = [];
    const urls = [];
    const privModules = [];
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
        } else {
          urls.push(`https://api.github.com/repos/${doc.data().owner}/${doc.data().repo_name}/collaborators/${user}`)
          privModules.push(m)
        }
      });

      const requests = urls.map(url => 
        axios.get(url,
          {
            headers: {
              'Authorization': `Bearer ${BEARER_TOKEN}`
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

  const moduleRef = doc(db, 'modules', req.query.id)
  const d = await getDoc(moduleRef);
  console.log(d)
  if (!d.exists) {
    res.status(400).send('No doc')
  } else {
    res.status(200).send(d.data())
  }
}

export const createModule = async (req, res, next) => {
    try {
      const data = req.body;
      await addDoc(collection(db, 'modules'), data);
      res.status(200).send('module created successfully');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

export const readFiles = async(req, res, next) => {
    const data = req.body
    console.log('data', data)

    // Get Github API token 
    const BEARER_TOKEN = await getGithubToken(db, config.testing_uid)
    
    // 
    const fileName = data.path.split('.')[0]
    const requests = [
      axios.get(`https://api.github.com/repos/${data.owner}/${data.repo}/contents/${fileName}.md`, {
      headers: {
              'Accept': 'application/vnd.github.raw+json',
              'Authorization': `Bearer ${BEARER_TOKEN}`}}),
      axios.get(`https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.path}`, {
          headers: {
              'Accept': 'application/vnd.github.raw+json',
              'Authorization': `Bearer ${BEARER_TOKEN}`}}),
    ]
    let files = []
    axios.all(requests)
    .then(axios.spread((...responses) => {
        responses.forEach((response, _) => {
            console.log('response', response.data)
            files.push(response.data)
        });
        res.status(200).send(files)
    }))
}

export const getKnowledge = async(req, res, next) => {
  // try {
    const requests = []
    const data = req.body
    const BEARER_TOKEN = await getGithubToken(db, config.testing_uid)
    Object.entries(data.checked).forEach((idx) => {
      console.log('index', idx)
      if (idx[1]) {
          const mod = data.modules.find(item => item.id === idx[0]);
          if (mod) {
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
          }
      }
    })
    let updatedKnowledge = {}
    axios.all(requests)
    .then(axios.spread((...responses) => {
        responses.forEach((response, _) => {
            console.log('response', response)
            if (response.data) {
              updatedKnowledge[response.data.name] = response.data
            }
        });
        console.log('Updated knowledge', updatedKnowledge)
        res.status(200).send(updatedKnowledge);
    }))
  // } catch(error) {
  //   res.status(400).send(error)
  // }
  
}