import express from 'express';

import {
  getModules,
  getModule,
  createModule, 
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
router.get('/module', getModule)
router.post('/createModule', createModule)
router.post('/fetch', readFiles)
router.post('/get_knowledge', getKnowledge)
router.get('/communities', getCommunities)
router.get('/getUser', getUser)
router.post('/createUser', createUser)
router.post('/updateUser', updateChecked)

export default router;