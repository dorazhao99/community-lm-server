import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config.js';
import { logger } from './libs/logger.js'
import moduleRoute from './routes/moduleRoute.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AssertionError } from 'assert'
import OpenAI from 'openai';


const app = express();
const corsOptions ={
  origin:config.clientUrl, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

// create a write stream (in append mode)
const __filename = fileURLToPath(import.meta.url);
var accessLogStream = fs.createWriteStream(path.join(path.dirname(__filename), 'morgan/access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('short', { stream: accessLogStream, skip: function (req, res) { return res.statusCode < 400 } }))
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
//routes
app.use('/api', moduleRoute);


// error handling
// app.use(function (req, res, next) {
//   var err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// app.use(function handleAssertionError(error, req, res, next) {
//   if (error instanceof AssertionError) {
//     //logger.error(error.message);
//     console.log(error.message);
//     return res.status(400).json({
//       type: "AssertionError",
//       message: "Not Found",
//     });
//   }
//   next(error);
// });

export {
  app,
}