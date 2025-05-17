import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
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

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background-color: ${props => props.theme.colors.success};
  color: white;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
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

const HelpText = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
`;

const validationSchema = Yup.object({
  name: Yup.string().required('Form name is required'),
  redirectUrl: Yup.string().url('Must be a valid URL').nullable(),
});

const CreateForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [createdForm, setCreatedForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002';
  
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/forms`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCreatedForm(response.data.form);
      toast.success('Form created successfully!');
    } catch (error) {
      console.error('Error creating form:', error);
      
      if (error.response?.status === 403) {
        toast.error('You have reached your form limit. Please upgrade your plan.');
      } else if (error.response?.data?.errors) {
        // Handle validation errors from the server
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach(key => {
          setFieldError(key, serverErrors[key]);
        });
      } else {
        toast.error('Failed to create form. Please try again.');
      }
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard!');
  };
  
  // Generate the form URL based on the endpoint ID
  const getFormUrl = (endpointId) => {
    return `${apiUrl}/f/${endpointId}`;
  };
  
  return (
    <Container>
      <Title>Create New Form</Title>
      
      {createdForm ? (
        <FormContainer>
          <SuccessMessage>
            <h3>Form Created Successfully!</h3>
            <p>Your form is now ready to use. Copy the code below to integrate it into your website.</p>
          </SuccessMessage>
          
          <h3>Form Endpoint URL:</h3>
          <CodeBlock>
            {getFormUrl(createdForm.endpoint_id)}
          </CodeBlock>
          <CopyButton onClick={() => copyToClipboard(getFormUrl(createdForm.endpoint_id))}>
            Copy URL
          </CopyButton>
          
          <h3 style={{ marginTop: '30px' }}>HTML Form Example:</h3>
          <CodeBlock>
{`<form action="${getFormUrl(createdForm.endpoint_id)}" method="POST">
  <input type="text" name="name" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <!-- Honeypot field to prevent spam -->
  <input type="text" name="_gotcha" style="display:none" />
  <button type="submit">Send</button>
</form>`}
          </CodeBlock>
          <CopyButton onClick={() => copyToClipboard(
            `<form action="${getFormUrl(createdForm.endpoint_id)}" method="POST">
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
          
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate(`/forms/${createdForm.id}/settings`)}>
              Form Settings
            </Button>
          </div>
        </FormContainer>
      ) : (
        <FormContainer>
          <Formik
            initialValues={{
              name: '',
              redirectUrl: '',
              emailNotifications: true,
              spamProtection: true
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <FormGroup>
                  <Label htmlFor="name">Form Name</Label>
                  <Input type="text" id="name" name="name" placeholder="Contact Form" />
                  <ErrorMessage name="name" component={Error} />
                  <HelpText>This is for your reference only and won't be shown to users</HelpText>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
                  <Input 
                    type="text" 
                    id="redirectUrl" 
                    name="redirectUrl" 
                    placeholder="https://yourdomain.com/thank-you" 
                  />
                  <ErrorMessage name="redirectUrl" component={Error} />
                  <HelpText>
                    Where to send users after form submission. Leave empty to show a default success message.
                  </HelpText>
                </FormGroup>
                
                <FormGroup>
                  <Checkbox>
                    <Field type="checkbox" id="emailNotifications" name="emailNotifications" />
                    <Label htmlFor="emailNotifications" style={{ display: 'inline', marginBottom: 0 }}>
                      Email notifications for new submissions
                    </Label>
                  </Checkbox>
                  <HelpText>
                    You'll receive an email notification whenever someone submits this form
                  </HelpText>
                </FormGroup>
                
                <FormGroup>
                  <Checkbox>
                    <Field type="checkbox" id="spamProtection" name="spamProtection" />
                    <Label htmlFor="spamProtection" style={{ display: 'inline', marginBottom: 0 }}>
                      Enable spam protection
                    </Label>
                  </Checkbox>
                  <HelpText>
                    Adds honeypot fields and other techniques to prevent spam submissions
                  </HelpText>
                </FormGroup>
                
                <Button type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting || isLoading ? 'Creating...' : 'Create Form'}
                </Button>
              </Form>
            )}
          </Formik>
        </FormContainer>
      )}
    </Container>
  );
};

export default CreateForm;
