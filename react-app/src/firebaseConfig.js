
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCX7EwA1t1gRC0prLC_-oSpsD7j0NlcJl0",
    authDomain: "medicalbillmanagement.firebaseapp.com",
    projectId: "medicalbillmanagement",
    storageBucket: "medicalbillmanagement.appspot.com",
    messagingSenderId: "466707456150",
    appId: "1:466707456150:web:acd8d4978913f081f822b7",
    measurementId: "G-J6R2PTCSQK"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

// Enable authentication persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  export default firebaseConfig;