import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 80px 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${props => props.theme.colors.primaryDark};
      text-decoration: none;
    }
  }
  
  &.secondary {
    background-color: white;
    color: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.primary};
    
    &:hover {
      background-color: #f5f5f5;
      text-decoration: none;
    }
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 60px;
  font-size: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
`;

const Home = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <HomeContainer>
      <HeroSection>
        <Title>Simple Form Backend for Developers</Title>
        <Subtitle>
          EasyForms provides a simple API endpoint for your HTML forms. No need for a backend - just point your form to our URL and we'll handle the rest.
        </Subtitle>
        <ButtonGroup>

          {isAuthenticated ? (
            <Button to="/dashboard" className="primary">
              Dashboard
            </Button>
          ) : (
            <Button to="/register" className="primary">
              Get Started
            </Button>
          )}

          <Button to="/pricing" className="secondary">View Pricing</Button>
        </ButtonGroup>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose EasyForms?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>Easy Integration</FeatureTitle>
            <FeatureDescription>
              Just point your form's action attribute to our endpoint. No JavaScript or backend code required.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Spam Protection</FeatureTitle>
            <FeatureDescription>
              Built-in spam filtering keeps your inbox clean from unwanted submissions.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Email Notifications</FeatureTitle>
            <FeatureDescription>
              Get instant email notifications when someone submits your form.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>File Uploads</FeatureTitle>
            <FeatureDescription>
              Accept file uploads through your forms with our simple API.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Custom Redirects</FeatureTitle>
            <FeatureDescription>
              Redirect users to a thank you page after form submission.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Submission Dashboard</FeatureTitle>
            <FeatureDescription>
              View and manage all your form submissions in one place.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default Home;