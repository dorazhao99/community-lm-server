# Knoll Expess Server

## Setup Instructions

### Install Git and clone this repository
* `git clone https://github.com/farnazj/Feed-Reranker-Server`

### Install Node Module Dependencies
cd to the root directory of the project where package.json is. Run:
* `npm install`

### Setup Environment Variables
The server looads environment variables from a .env file into process.env.

* Create a .env file in the root directory of the project (no name before the extension)
* Place the following variables in the file and assign values to them:
    + NODE_ENV (one of 'development', 'test', or 'production'. The default is set to 'development')

### Service Configurations
#### Firebase
- Setup a Firebase Cloud Firestore database. Save the service keys in a file named `serviceKeys.json` in the top-level of the directory.
- Save your Firebase config information in the .env file

#### Google Docs API
- Setup a Google Docs service account. Save the service keys in a file named `serviceKeys_docs.json` in the top-level of the directory. 


#### Run the Server
cd to the root directory of the project. Run:
* `npm start`
