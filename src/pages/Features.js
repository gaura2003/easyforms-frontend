import React from 'react';
import styled from 'styled-components';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textLight};
  max-width: 700px;
  margin: 0 auto 30px;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
  
  svg {
    margin-left: 8px;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    text-decoration: none;
    color: white;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.colors.lightBg};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  svg {
    width: 30px;
    height: 30px;
    color: ${props => props.theme.colors.primary};
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  line-height: 1.6;
`;

const ComparisonSection = styled.div`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  color: ${props => props.theme.colors.text};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightBg};
  
  &:first-child {
    width: 250px;
  }
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &.check {
    color: ${props => props.theme.colors.success};
  }
`;

const TestimonialSection = styled.div`
  margin-bottom: 60px;
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const TestimonialCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const Quote = styled.p`
  font-style: italic;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.lightBg};
  margin-right: 15px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div`
  .name {
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
  
  .title {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textLight};
  }
`;

const CTAA = styled.div`
  text-align: center;
  background-color: ${props => props.theme.colors.lightBg};
  padding: 60px 20px;
  border-radius: 8px;
`;

const CTATitle = styled.h2`
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const CTAText = styled.p`
  color: ${props => props.theme.colors.textLight};
  max-width: 600px;
  margin: 0 auto 30px;
`;

const Features = () => {
  return (
    <FeaturesContainer>
      <Hero>
        <Title>Powerful Form Features for Every Need</Title>
        <Subtitle>
          EasyForms provides all the tools you need to create, manage, and analyze your forms with ease.
          No coding required.
        </Subtitle>
        <CTAButton to="/register">
          Get Started for Free <FiArrowRight />
        </CTAButton>
      </Hero>
      
      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </FeatureIcon>
          <FeatureTitle>Drag & Drop Form Builder</FeatureTitle>
          <FeatureDescription>
            Create beautiful forms in minutes with our intuitive drag and drop builder. 
            No coding skills required.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </FeatureIcon>
          <FeatureTitle>Email Notifications</FeatureTitle>
          <FeatureDescription>
            Get instant notifications when someone submits your form. 
            Never miss an important submission again.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="9" x2="20" y2="9"></line>
              <line x1="4" y1="15" x2="20" y2="15"></line>
              <line x1="10" y1="3" x2="8" y2="21"></line>
              <line x1="16" y1="3" x2="14" y2="21"></line>
            </svg>
          </FeatureIcon>
          <FeatureTitle>Custom Endpoints</FeatureTitle>
          <FeatureDescription>
            Each form gets its own unique endpoint that you can embed anywhere. 
            Works with any website or platform.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </FeatureIcon>
          <FeatureTitle>Custom Form Fields</FeatureTitle>
          <FeatureDescription>
            Create forms with a wide variety of field types including text, email, 
            phone, dropdown, checkboxes, and more.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </FeatureIcon>
          <FeatureTitle>Submission Management</FeatureTitle>
          <FeatureDescription>
            View, search, and export all your form submissions in one place. 
            Download as CSV for easy analysis.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </FeatureIcon>
          <FeatureTitle>Spam Protection</FeatureTitle>
          <FeatureDescription>
            Built-in spam protection keeps your forms secure and your inbox clean. 
            No more dealing with spam submissions.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
      
      <ComparisonSection>
        <SectionTitle>Compare Plans</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Feature</Th>
              <Th>Free</Th>
              <Th>Pro</Th>
              <Th>Enterprise</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Number of Forms</Td>
              <Td>3</Td>
              <Td>20</Td>
              <Td>100</Td>
            </tr>
            <tr>
              <Td>Monthly Submissions</Td>
              <Td>100</Td>
              <Td>5,000</Td>
              <Td>50,000</Td>
            </tr>
            <tr>
              <Td>Custom Redirect URLs</Td>
              <Td>-</Td>
              <Td className="check"><FiCheckCircle /></Td>
              <Td className="check"><FiCheckCircle /></Td>
            </tr>
            <tr>
              <Td>File Uploads</Td>
              <Td>-</Td>
              <Td className="check"><FiCheckCircle /></Td>
              <Td className="check"><FiCheckCircle /></Td>
            </tr>
            <tr>
              <Td>Priority Support</Td>
              <Td>-</Td>
              <Td>-</Td>
              <Td className="check"><FiCheckCircle /></Td>
            </tr>
            <tr>
              <Td>Remove EasyForms Branding</Td>
              <Td>-</Td>
              <Td className="check"><FiCheckCircle /></Td>
                            <Td className="check"><FiCheckCircle /></Td>
            </tr>
            <tr>
              <Td>Dedicated Account Manager</Td>
              <Td>-</Td>
              <Td>-</Td>
              <Td className="check"><FiCheckCircle /></Td>
            </tr>
          </tbody>
        </Table>
      </ComparisonSection>
      
      <TestimonialSection>
        <SectionTitle>What Our Customers Say</SectionTitle>
        <TestimonialGrid>
          <TestimonialCard>
            <Quote>
              "EasyForms has completely transformed how we collect information from our clients. 
              The setup was incredibly simple and the submissions management is top-notch."
            </Quote>
            <Author>
              <Avatar>
                <img src="https://randomuser.me/api/portraits/women/43.jpg" alt="Sarah Johnson" />
              </Avatar>
              <AuthorInfo>
                <div className="name">Sarah Johnson</div>
                <div className="title">Marketing Director, TechCorp</div>
              </AuthorInfo>
            </Author>
          </TestimonialCard>
          
          <TestimonialCard>
            <Quote>
              "We've tried several form solutions, but EasyForms stands out with its simplicity and powerful features.
              The spam protection alone has saved us countless hours."
            </Quote>
            <Author>
              <Avatar>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael Chen" />
              </Avatar>
              <AuthorInfo>
                <div className="name">Michael Chen</div>
                <div className="title">Web Developer, DesignHub</div>
              </AuthorInfo>
            </Author>
          </TestimonialCard>
          
          <TestimonialCard>
            <Quote>
              "As a small business owner, I needed something affordable yet professional.
              EasyForms delivers exactly that, and their customer support is exceptional."
            </Quote>
            <Author>
              <Avatar>
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Emily Rodriguez" />
              </Avatar>
              <AuthorInfo>
                <div className="name">Emily Rodriguez</div>
                <div className="title">Owner, Bloom Boutique</div>
              </AuthorInfo>
            </Author>
          </TestimonialCard>
        </TestimonialGrid>
      </TestimonialSection>
      
      <CTAA>
        <CTATitle>Ready to get started with EasyForms?</CTATitle>
        <CTAText>
          Join thousands of businesses that use EasyForms to collect and manage form submissions.
          No credit card required to get started.
        </CTAText>
        <CTAButton to="/register">
          Create Your Free Account <FiArrowRight />
        </CTAButton>
      </CTAA>
    </FeaturesContainer>
  );
};

export default Features;
