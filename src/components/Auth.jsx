import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import './Auth.css';
import { Button } from '@mui/material';
import { auth } from '../firebase/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, where } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Auth({ register }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate()

  const isRegisterForm = register ? true : false;

  const handleRegister = async () => {
    if(!username || !password || !email){
      toast.warning("Please Fill The Form Completely!")
    }
    else{
      try {
  
        // Register the user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
  
        // Save additional user details to Firestore
        // Note: I've removed the 'app.' before 'firestore()' since 'app' is not used directly here
        const db = getFirestore();
        const usersCollection = collection(db, 'users'); // create a collection reference
        await addDoc(usersCollection, {
          username: username,
          email: email,
          uid: userId
        });
  
        // console.log('User registered successfully!');
        toast.success('Registered successfully!');
  
        navigate(`/login`)
  
      } catch (error) {
        // console.error('Error registering user:', error.message);
        let errorMessage = 'Error registering user:';
  
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password must be at least 6 characters.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'Email address is already in use.';
            break;
          default:
            errorMessage += ` ${error.message}`;
        }
    
        toast.error(errorMessage);    
      }
    }
  };

  const handleLogin = async () => {
    try {
      // Log in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
  
      // Initialize Firestore
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
  
      // Query the collection based on the user's UID
      await getDocs(usersCollection, where('uid', '==', userId));
  
      navigate(`/document`);

    } catch (error) {
      // console.error('Error logging in:', error.message);
      toast.error(`Invalid Username or Password!`);
    }
  };

  return (
    <div style={{ width: '100', height: '100vh' }} className='d-flex flex-column justify-content-center align-items-center'>
      <div className='w-75 container'>
        <Link to={'/'} style={{ textDecoration: 'none', color: 'mediumblue' }}><i className="fa-solid fa-arrow-left me-2"></i>Back to home</Link>
        <div className='mt-2'>
          <div className='row align-items-center'>
            <div className='d-flex col-md-3'></div>
            <div className='input-container col-sm-12 col-md-6 p-4 card shadow border-1 border-info'>
              <div className="d-flex align-items-center flex-column">
                <h1 className='fw-bolder mt-2'>DocsApp</h1>
                <h5 className='fw-bolder mt-2 pb-3'>
                  {isRegisterForm ? 'Sign Up to your Account' : 'Sign In to your Account'}
                </h5>
                <form style={{ width: '80%' }} className='d-flex flex-column'>
                  {isRegisterForm && (
                    <Form.Group className="mb-3" controlId="formBasicName">
                      <Form.Control
                        className='input-field'
                        type="email"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      className='input-field'
                      type="email"
                      placeholder="Enter Email ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                      className='input-field'
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  {isRegisterForm ? (
                    <div>
                      <Button variant="outlined" className='fw-bold shadow mb-2' onClick={handleRegister}>Register</Button>
                      <p>Already have Account? Click here to <Link to={'/login'} className='text-primary'>Login</Link></p>
                    </div>
                  ) : (
                    <div>
                      <Button variant="outlined" className='fw-bold shadow mb-2' onClick={handleLogin}>Login</Button>
                      <p>New User? Click here to <Link to={'/register'} className='text-primary'>Register</Link></p>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <div className='col-md-3 d-flex'></div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000} // Close the toast after 3 seconds
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Auth;
