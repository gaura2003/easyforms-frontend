import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: ${props => props.theme.colors.text};
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
`;

const Error = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 14px;
  margin-top: 5px;
`;

const Button = styled.button`
  width: 100%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 20px;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
  }
`;

const Alert = styled.div`
  padding: 10px;
  background-color: ${props => props.theme.colors.danger};
  color: white;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    
    const result = await register(values.name, values.email, values.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setSubmitting(false);
    }
  };
  
  return (
    <Container>
      <Title>Sign Up</Title>
      
      <FormContainer>
        {error && <Alert>{error}</Alert>}
        
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" />
                <ErrorMessage name="name" component={Error} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" />
                <ErrorMessage name="email" component={Error} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" />
                <ErrorMessage name="password" component={Error} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input type="password" id="confirmPassword" name="confirmPassword" />
                <ErrorMessage name="confirmPassword" component={Error} />
              </FormGroup>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Form>
          )}
        </Formik>
        
        <LoginLink>
          Already have an account? <Link to="/login">Log in</Link>
        </LoginLink>
      </FormContainer>
    </Container>
  );
};

export default Register;