// src/pages/Login.jsx

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { attemptLogin } from '../redux/slices/userSlice';
import { io } from 'socket.io-client';
import '../styles.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);

  const initialValues = {
    email: 'john@example.com',
    password: 'mypassword123',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    const result = await dispatch(attemptLogin({ credentials: values, socket }));
    setSubmitting(false);

    if (attemptLogin.fulfilled.match(result)) {
      navigate('/');
    } else {
      alert(result.error?.message || 'Login failed!');
    }
  };

  useEffect(() => {
    const newSocket = io('http://127.0.0.1:3001');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className='page login-form'>
      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Formik
        id="login-form"
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="email">Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>Login</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
