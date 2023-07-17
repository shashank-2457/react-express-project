const firebaseConfig = require('./firebaseConfig');
const cors = require('cors');
const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const fs = require('fs');

const serviceAccount = require('./medicalbillmanagement-firebase-adminsdk-wsed1-e2a128a685.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:"https://medicalbillmanagement.firebaseio.com"
  });


  const app = express();
  app.use(cors());

  // Configure multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  });
  
  // Create multer instance
  const upload = multer({ storage });
  app.get('/api/bills/:uid', async (req, res) => {
    try {
      const uid = req.params.uid;
      console.log(uid)
  
      // Access the Firestore collection for the specific user ID
      const firestore = admin.firestore();
      const billsRef = await firestore.collection(uid).get();
      
      // Extract the bill data from the Firestore query snapshot
      const bills = [];
      //console.log(billsRef)
      billsRef.forEach((doc) => {
        
        const bill = doc.data();
        
        bills.push(bill);
      });
      console.log(bills)
  
      res.status(200).json({ success: true, bills });
    } catch (error) {
      console.error('Error fetching bills:', error);
      res.status(500).json({ error: 'Error fetching bills' });
    }
  });
  // Endpoint to handle form data and image upload
  app.post('/api/bills', upload.single('billPicture'), async (req, res) => {
    console.log(req)
    try {
      // Extract form fields
      const { uid,patientName, patientAddress, hospitalName, dateOfService, billAmount,billPicture } = req.body;
  
      // Create a new bill object
      const billData = {
        uid,
        patientName,
        patientAddress,
        hospitalName,
        dateOfService,
        billAmount,
        billPicture
      };
  

  
      // Save the bill data to Firebase Firestore
      const firestore = admin.firestore();
      const out = `${uid}`
      const billRef = await firestore.collection(out).add(billData);
  
      res.status(200).json({ success: true, billId: billRef.id });
    } catch (error) {
      console.error('Error uploading image or saving bill data:', error);
      res.status(500).json({ error: 'Error uploading image or saving bill data' });
    }
  });
  
  // Start the server
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });