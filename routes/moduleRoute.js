import express from 'express';

import {
  getModules,
  getGalleryModules,
  getUserModules,
  getUserModulesOld,
  getModule,
  addGithubModule,
  addGoogleModule,
  selectModule, 
  readFiles,
  getKnowledge,
  deleteModule,
  getStarterPacks,
  getGoogleDocs,
  addKnowledge
} from '../controllers/moduleController.js';

import {
  getCommunities,
  getCommunity,
  selectCommunity
} from '../controllers/communityController.js'

import {
  getUser,
  createUser,
  createGuest,
  updateChecked,
  updateCount,
  getUserMessages,
  createGist,
  deleteChip,
  updateUser
} from '../controllers/userController.js'

import {
  queryGPT
} from '../controllers/gptController.js';

import {
  storeMessage,
} from '../controllers/messageController.js';

import {
  getMessage,
  getUsers,
  getModuleKnowledge,
  createPairs,
  // createTechnical
} from '../controllers/adminController.js'

import {
  createSurvey,
  getPreferencePairs,
  getTechnicalPairs,
  setAnnotations
} from '../controllers/surveyController.js'

import {
  createLog
} from '../controllers/logController.js'

const router = express.Router();

router.get('/', getModules);
router.get('/getGoogleDocs', getGoogleDocs);
router.get('/exploreModules', getGalleryModules);
router.get('/userModule', getUserModulesOld);
router.get('/userModule_v2', getUserModules);
router.get('/module', getModule)
router.post('/addGithubModule', addGithubModule)
router.post('/addGoogleModule', addGoogleModule)
router.post('/selectModule', selectModule)
router.post('/removeModule', deleteModule)
router.post('/fetch', readFiles)
router.post('/get_knowledge', getKnowledge)
router.get('/getStarter', getStarterPacks)
router.post('/addKnowledge', addKnowledge)

router.get('/communities', getCommunities)
router.get('/getCommunity', getCommunity)
router.post('/selectCommunity', selectCommunity)

router.get('/getUser', getUser)
router.post('/createUser', createUser)
router.post('/createGuest', createGuest)
router.post('/createGist', createGist)
router.post('/deleteChip', deleteChip)

router.post('/logAction', createLog)

router.post('/updateUser', updateChecked)
router.post('/updateCount', updateCount)
router.post('/queryGPT', queryGPT)
router.post('/storeMessage', storeMessage)
router.post('/submitSurvey', createSurvey)
router.get('/getPreferencePairs', getPreferencePairs)
router.get('/getTechnicalPairs', getTechnicalPairs)
router.post('/setAnnotations', setAnnotations)
router.post('/updateUserInfo', updateUser)
// router.get('/getMessages', getUserMessages)


// router.post('/admin/createTechnical', createTechnical)
// router.get('/admin/getModuleKnowledge', getModuleKnowledge)
// router.post('/admin/createPairs', createPairs)

// router.get('/admin/getMessage', getMessage)
// router.get('/admin/getUsers', getUsers)



export default router;