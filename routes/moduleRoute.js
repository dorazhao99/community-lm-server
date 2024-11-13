import express from 'express';

import {
  getModules,
  getModule,
  readFiles,
  getKnowledge
} from '../controllers/moduleController.js';

import {
  getCommunities
} from '../controllers/communityController.js'

import {
  authorizeUser,
  getUser,
  createUser
} from '../controllers/userController.js'

const router = express.Router();

router.get('/', getModules);
router.get('/module', getModule)
router.post('/fetch', readFiles)
router.post('/get_knowledge', getKnowledge)
router.get('/communities', getCommunities)
router.post('/authorizeUser', authorizeUser)
router.get('/getUser', getUser)
router.post('/createUser', createUser)

export default router;