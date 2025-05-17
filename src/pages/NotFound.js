import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const Message = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 40px;
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    text-decoration: none;
  }
`;

const NotFound = () => {
  return (
    <Container>
      <Title>404 - Page Not Found</Title>
      <Message>
        The page you are looking for doesn't exist or has been moved.
      </Message>
      <Button to="/">Back to Home</Button>
    </Container>
  );
};

export default NotFound;