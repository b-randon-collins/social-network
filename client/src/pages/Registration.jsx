// src/components/Registration.jsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Registration = () => {
    const navigate = useNavigate();

    const initialValues = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'mypassword123',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        const response = await fetch('http://localhost:3001/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (response.ok) {
            navigate('/login');
        } else {
            alert('Registration failed!');
        }

        setSubmitting(false);
    };

    return (
        <div className='page'>
            <h2>Register</h2>
            <Formik
                id="registration-form"
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="div" />
                        </div>
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
                        <button type="submit" disabled={isSubmitting}>Register</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Registration;
