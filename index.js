import express from 'express';
import { morganMiddleware } from './middleware/morganMiddleware.js'
import cors from 'cors';
import config from './config.js';
import moduleRoute from './routes/moduleRoute.js';



const app = express();
const corsOptions ={
  origin:config.clientUrl, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(morganMiddleware);
app.use(cors(corsOptions));
app.use(express.json());

//routes
app.use('/api', moduleRoute);

// app.listen(config.port, () =>
//   console.log(`Server is live @ ${config.hostUrl} and connected via cors to ${config.clientUrl}`),
// );

export {
  app
}