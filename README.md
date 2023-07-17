**Medical Bill Uploader**

A simple React app that allows users to upload medical bills.

**Prerequisites**

Before running the project, make sure you have the following prerequisites installed:

Node.js: Download and Install Node.js

npm: npm is installed with Node.js. Make sure you have npm version 6 or above.

**Installation**

Clone the repository from GitHub
Navigate to the project directory
Install dependencies

**Configuration**

Before running the application, you need to configure it with your Firebase project.

1. Create a Firebase project:

Go to the Firebase website (https://firebase.google.com) and sign in with your Google account.

Click on "Go to Console" or "Add project" to create a new Firebase project.

Enter a name for your project and select your country/region.

Review and agree to the terms and click "Create Project".

2. Set up Firebase in your project:

In the Firebase console, click on "Add Firebase to your web app" or the web icon (</>) to create a new Firebase app.
Copy the provided configuration object which includes properties such as apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, and appId.

3. Configure Firebase in the project:

In the project directory, open the file firebaseConfig.js

Replace the placeholder values in the file with your Firebase configuration:

REACT_APP_API_KEY=<your-api-key>

REACT_APP_AUTH_DOMAIN=<your-auth-domain>

REACT_APP_DATABASE_URL=<your-database-url>

REACT_APP_PROJECT_ID=<your-project-id>

REACT_APP_STORAGE_BUCKET=<your-storage-bucket>

REACT_APP_MESSAGING_SENDER_ID=<your-messaging-sender-id>

REACT_APP_APP_ID=<your-app-id>

**Running the Application**

To run the application, make sure you have completed the installation and configuration steps mentioned above. Then, follow the instructions below:

1. In the project directory, run the following commands:
   
cd react-app

npm install

npm start

2. The app will start running in the development mode.

3. Open http://localhost:3000 in your web browser to view the application.

The page will automatically reload if you make any changes to the code. You will also see any lint errors in the console.

**Backend Express.js Server**

The Medical Bill Uploader project uses an Express.js server for handling backend functionality. Follow the instructions below to set up and run the server.

**Prerequisites**

Before running the backend server, make sure you have the Node.js installed

**Configuration**

Before running the server, you need to configure it with your Firebase project. The server uses Firebase Admin SDK to interact with Firebase services.

1. Generate a private key file for your Firebase project:

Go to the Firebase console and select your project.

Click on the "Settings" icon (gear) next to "Project Overview" in the left sidebar.

Go to the "Service Accounts" tab.

Click on "Generate new private key".

Save the generated JSON file containing your private key securely.

2. Rename the private key file:

Copy the generated JSON file to the server directory.

Rename the file to firebase-key.json.

**Running the Server**

1. To run the backend server, follow the instructions below:
   
cd express

npm install

node server.js

2. The server will start running on http://localhost:8000.

3. The server is now ready to handle requests from the Medical Bill Uploader application.

**API endpoints used**

To fetch the data in home page

GET request: http://localhost:8000/api/bills/${uid}

To push the data to firestore

POST request: http://localhost:8000/api/bills
