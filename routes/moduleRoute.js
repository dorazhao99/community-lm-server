import express from 'express';

import {
  getModules,
  getGalleryModules,
  getUserModules,
  getUserModulesOld,
  getModule,
  addModule,
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
  createGist
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
  createPairs
} from '../controllers/adminController.js'

import {
  createSurvey,
  getPreferencePairs
} from '../controllers/surveyController.js'

const router = express.Router();

router.get('/', getModules);
router.get('/getGoogleDocs', getGoogleDocs);
router.get('/exploreModules', getGalleryModules);
router.get('/userModule', getUserModulesOld);
router.get('/userModule_v2', getUserModules);
router.get('/module', getModule)
router.post('/addModule', addModule)
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



router.post('/updateUser', updateChecked)
router.post('/updateCount', updateCount)
router.post('/queryGPT', queryGPT)
router.post('/storeMessage', storeMessage)
router.post('/submitSurvey', createSurvey)
router.get('/getPreferencePairs', getPreferencePairs)
router.get('/getMessages', getUserMessages)


router.get('/admin/getModuleKnowledge', getModuleKnowledge)
router.post('/admin/createPairs', createPairs)

router.get('/admin/getMessage', getMessage)
router.get('/admin/getUsers', getUsers)



export default router;