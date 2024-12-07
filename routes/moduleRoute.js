import express from 'express';

import {
  getModules,
  getUserModules,
  getModule,
  addModule, 
  readFiles,
  getKnowledge
} from '../controllers/moduleController.js';

import {
  getCommunities
} from '../controllers/communityController.js'

import {
  getUser,
  createUser,
  updateChecked
} from '../controllers/userController.js'


const router = express.Router();

router.get('/', getModules);
router.get('/userModule', getUserModules);
router.get('/module', getModule)
router.post('/addModule', addModule)
router.post('/fetch', readFiles)
router.post('/get_knowledge', getKnowledge)
router.get('/communities', getCommunities)
router.get('/getUser', getUser)
router.post('/createUser', createUser)
router.post('/updateUser', updateChecked)

export default router;