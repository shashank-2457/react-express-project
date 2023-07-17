import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from '../firebaseConfig';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import background from "../assets/bg-home-image.avif"

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

// Enable authentication persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

function HomePage() {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async (uid) => {
      try {
        // Make an API request to fetch bills for the current user
        const response = await fetch(`http://localhost:8000/api/bills/${uid}`);
        if (!response.ok) {
          throw new Error('Error fetching bills');
        }
        console.log("12222")
        const data = await response.json();
        console.log("1111")
        setBills(data.bills);
        console.log(data.bills)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    // Check if the user is already signed in
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      console.log("direct", user.uid);
      fetchBills(user.uid);
    } else {
      // Try to retrieve the user from local storage
      const storedUserId = localStorage.getItem('userId');
      console.log("refresh", storedUserId);
      if (storedUserId) {
        setUserId(storedUserId);
        fetchBills(storedUserId);
      } else {
        setLoading(false);
      }
    }

    // Listen for changes in the authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { uid } = user;
        setUserId(uid);
        localStorage.setItem('userId', uid);
        fetchBills(uid);
      } else {
        // User is not authenticated, redirect to login or handle as needed
        setUserId(null);
        console.log("refresh", localStorage.getItem("userId"));
        localStorage.removeItem('userId');
        navigate('/');
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  const handleAddBill = () => {
    navigate('/form');
  };

  const handleLogout = async () => {
    try {
      // Sign out the user
      await firebase.auth().signOut();
      navigate('/');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        padding: '20px',
        boxSizing: 'border-box', 
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: `${bills.length * (100)}px`,
          minWidth: '100%',
          maxHeight: '100%',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          paddingTop: '60px',
        }}
      >
        <Grid container spacing={3}>
          {bills.map((bill, index) => (
            <Grid item xs={11} sm={5} md={3} key={bill.id} style={{ marginTop: index === 0 ? '-40px' : '0' }} >
              <Card sx={{ borderRadius: '16px' }}>
                <img
                  src={bill.billPicture}
                  alt="Bill Picture"
                  className="card-img-top"
                  style={{ height: '200px' }}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {bill.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Patient Name:</strong> {bill.patientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Patient Address:</strong> {bill.patientAddress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Hospital Name:</strong> {bill.hospitalName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Bill Amount:</strong> {bill.billAmount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date of Service:</strong> {bill.dateOfService}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <br />
        <div
        className="button-container"
        style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', marginBottom: '1rem' }}
      >
        <Link to="/form">
          <Button variant="contained" color="primary" sx={{ marginRight: '1rem' }}>
            Add New Bill
          </Button>
        </Link>
        <Link to="/">
          <Button variant="contained" color="error">
            Logout
          </Button>
        </Link>
      </div>
    </div>
  </div>
);  
}

export default HomePage;



