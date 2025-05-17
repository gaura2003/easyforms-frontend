import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiSave, FiTrash2, FiArrowLeft } from 'react-icons/fi';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  margin-right: 15px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0;
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

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: 10px;
  }
`;

const Error = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 14px;
  margin-top: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
  }
  
  &.danger {
    background-color: ${props => props.theme.colors.danger};
    
    &:hover {
      background-color: ${props => props.theme.colors.dangerDark};
    }
  }
`;

const CodeBlock = styled.pre`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin-top: 10px;
  font-family: monospace;
`;

const CopyButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondaryDark};
  }
`;

const validationSchema = Yup.object({
  name: Yup.string().required('Form name is required'),
  redirectUrl: Yup.string().url('Must be a valid URL').nullable(),
});

const FormDetail = () => {
  const { formId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms/${formId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setForm(response.data.form);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form:', error);
        navigate('/dashboard');
      }
    };
    
    fetchForm();
  }, [formId, token, navigate]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms/${formId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setForm(response.data.form);
      alert('Form updated successfully');
      setSubmitting(false);
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Failed to update form');
      setSubmitting(false);
    }
  };
  
  const handleDeleteForm = async () => {
    if (window.confirm('Are you sure you want to delete this form? All submissions will be lost.')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms/${formId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('Failed to delete form');
      }
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };
  
  if (loading) {
    return <Container>Loading...</Container>;
  }
  
  const formUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/f/${form.endpoint_id}`;
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          <FiArrowLeft size={20} />
        </BackButton>
        <Title>Edit Form</Title>
      </Header>
      
      <FormContainer>
        <h3>Form Endpoint URL:</h3>
        <CodeBlock>
          {formUrl}
        </CodeBlock>
        <CopyButton onClick={() => copyToClipboard(formUrl)}>
          Copy URL
        </CopyButton>
        
        <h3 style={{ marginTop: '30px' }}>HTML Form Example:</h3>
        <CodeBlock>
{`<form action="${formUrl}" method="POST">
  <input type="text" name="name" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <!-- Honeypot field to prevent spam -->
  <input type="text" name="_gotcha" style="display:none" />
  <button type="submit">Send</button>
</form>`}
        </CodeBlock>
        <CopyButton onClick={() => copyToClipboard(
          `<form action="${formUrl}" method="POST">
  <input type="text" name="name" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <!-- Honeypot field to prevent spam -->
  <input type="text" name="_gotcha" style="display:none" />
  <button type="submit">Send</button>
</form>`
        )}>
          Copy HTML
        </CopyButton>
        
        <Formik
          initialValues={{
            name: form.name || '',
            redirectUrl: form.redirect_url || '',
            emailNotifications: form.email_notifications === 1,
            spamProtection: form.spam_protection === 1
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ marginTop: '30px' }}>
              <FormGroup>
                <Label htmlFor="name">Form Name</Label>
                <Input type="text" id="name" name="name" />
                <ErrorMessage name="name" component={Error} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
                <Input type="text" id="redirectUrl" name="redirectUrl" placeholder="https://yourdomain.com/thank-you" />
                <ErrorMessage name="redirectUrl" component={Error} />
                <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                  Where to send users after form submission
                </p>
              </FormGroup>
              
              <FormGroup>
                <Checkbox>
                  <Field type="checkbox" id="emailNotifications" name="emailNotifications" />
                  <Label htmlFor="emailNotifications" style={{ display: 'inline', marginBottom: 0 }}>
                    Email notifications for new submissions
                  </Label>
                </Checkbox>
              </FormGroup>
              
              <FormGroup>
                <Checkbox>
                  <Field type="checkbox" id="spamProtection" name="spamProtection" />
                  <Label htmlFor="spamProtection" style={{ display: 'inline', marginBottom: 0 }}>
                    Enable spam protection
                  </Label>
                </Checkbox>
              </FormGroup>
              
              <ButtonGroup>
                <Button type="submit" disabled={isSubmitting}>
                  <FiSave /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" className="danger" onClick={handleDeleteForm}>
                  <FiTrash2 /> Delete Form
                </Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </FormContainer>
    </Container>
  );
};

export default FormDetail;