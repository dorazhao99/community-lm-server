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
  getStarterPacks
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
  updateCount
} from '../controllers/userController.js'

import {
  queryGPT
} from '../controllers/gptController.js';

import {
  storeMessage,
} from '../controllers/messageController.js';

import {
  getMessage
} from '../controllers/adminController.js'

import {
  createSurvey
} from '../controllers/surveyController.js'

const router = express.Router();

router.get('/', getModules);
router.get('/exploreModules', getGalleryModules);
router.get('/userModule', getUserModulesOld);
router.get('/userModule_v2', getUserModules);
router.get('/module', getModule)
router.post('/addModule', addModule)
router.post('/selectModule', selectModule)
router.post('/removeModule', deleteModule)
router.post('/fetch', readFiles)
router.post('/get_knowledge', getKnowledge)
router.get('/communities', getCommunities)
router.get('/getCommunity', getCommunity)
router.post('/selectCommunity', selectCommunity)
router.get('/getUser', getUser)
// router.get('/admin/getMessage', getMessage)
router.post('/createUser', createUser)
router.post('/createGuest', createGuest)
router.post('/updateUser', updateChecked)
router.post('/updateCount', updateCount)
router.post('/queryGPT', queryGPT)
router.post('/storeMessage', storeMessage)
router.get('/getStarter', getStarterPacks)
router.post('/submitSurvey', createSurvey)


export default router;