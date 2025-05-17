import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import RazorpayCheckout from '../components/RazorpayCheckout';
import { FiCheck, FiX } from 'react-icons/fi';

const PricingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 40px;
  color: ${props => props.theme.colors.textLight};
  font-size: 18px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const ToggleButton = styled.button`
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
`;

const SaveBadge = styled.span`
  background-color: ${props => props.theme.colors.success};
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: 10px;
`;

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const PlanCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  ${props => props.featured && `
    border: 2px solid ${props.theme.colors.primary};
    position: relative;
    
    &::before {
      content: 'Popular';
      position: absolute;
      top: -12px;
      right: 20px;
      background-color: ${props.theme.colors.primary};
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
  `}
`;

const PlanName = styled.h2`
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const PlanPrice = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
  
  span {
    font-size: 16px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const PlanDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 20px;
  font-size: 14px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
  flex-grow: 1;
`;

const Feature = styled.li`
  padding: 8px 0;
  display: flex;
  align-items: center;
  color: ${props => props.included ? props.theme.colors.text : props.theme.colors.textLight};
  
  svg {
    margin-right: 10px;
    color: ${props => props.included ? props.theme.colors.success : props.theme.colors.danger};
  }
`;

const SubscribeButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const CurrentPlanBadge = styled.div`
  background-color: ${props => props.theme.colors.success};
  color: white;
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  font-weight: 500;
  margin-top: 10px;
`;

const SignInPrompt = styled.div`
  text-align: center;
  margin-top: 10px;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [interval, setInterval] = useState('monthly');
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions/plans`);
        setPlans(response.data.plans);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  
  const getPlanDescription = (planName) => {
    switch(planName) {
      case 'free':
        return 'Perfect for individuals just getting started with form collection';
      case 'pro':
        return 'Ideal for professionals who need more forms and advanced features';
      case 'enterprise':
        return 'For businesses with high volume needs and premium support';
      default:
        return '';
    }
  };
  
  const isCurrentPlan = (planName) => {
    return isAuthenticated && user && user.subscription_tier === planName;
  };
  
  if (loading) {
    return <PricingContainer>Loading pricing plans...</PricingContainer>;
  }
  
  return (
    <PricingContainer>
      <Title>Simple, Transparent Pricing</Title>
      <Subtitle>
        Choose the plan that fits your needs. All plans include unlimited form customization, 
        spam protection, and basic analytics.
      </Subtitle>
      
      <ToggleContainer>
        <ToggleButton 
          active={interval === 'monthly'} 
          onClick={() => setInterval('monthly')}
        >
          Monthly
        </ToggleButton>
        <ToggleButton 
          active={interval === 'yearly'} 
          onClick={() => setInterval('yearly')}
        >
          Yearly
          <SaveBadge>Save 20%</SaveBadge>
        </ToggleButton>
      </ToggleContainer>
      
      <PlansContainer>
        {plans.map(plan => (
          <PlanCard key={plan.id} featured={plan.name === 'pro'}>
            <PlanName>{plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}</PlanName>
            <PlanPrice>
              ${interval === 'monthly' ? plan.monthly_price : plan.yearly_price}
              <span>/{interval === 'monthly' ? 'month' : 'year'}</span>
            </PlanPrice>
            
            <PlanDescription>{getPlanDescription(plan.name)}</PlanDescription>
            
            <FeaturesList>
              <Feature included={true}>
                <FiCheck /> <strong>{plan.form_limit}</strong> forms
              </Feature>
              <Feature included={true}>
                <FiCheck /> <strong>{plan.submission_limit_monthly.toLocaleString()}</strong> submissions/month
              </Feature>
              <Feature included={plan.custom_redirect}>
                {plan.custom_redirect ? <FiCheck /> : <FiX />} Custom redirect URLs
              </Feature>
              <Feature included={plan.file_uploads}>
                {plan.file_uploads ? <FiCheck /> : <FiX />} File uploads
              </Feature>
              <Feature included={plan.priority_support}>
                {plan.priority_support ? <FiCheck /> : <FiX />} Priority support
              </Feature>
              <Feature included={plan.name !== 'free'}>
                {plan.name !== 'free' ? <FiCheck /> : <FiX />} No EasyForms branding
              </Feature>
              <Feature included={plan.name === 'enterprise'}>
                {plan.name === 'enterprise' ? <FiCheck /> : <FiX />} Dedicated account manager
              </Feature>
            </FeaturesList>
            
            {isAuthenticated ? (
              isCurrentPlan(plan.name) ? (
                <CurrentPlanBadge>Current Plan</CurrentPlanBadge>
              ) : (
                plan.name !== 'free' ? (
                  <RazorpayCheckout plan={plan} interval={interval} />
                ) : (
                  <SubscribeButton disabled={isCurrentPlan(plan.name)}>
                    Free Plan
                  </SubscribeButton>
                )
              )
            ) : (
              <>
                <SubscribeButton disabled>Select Plan</SubscribeButton>
                <SignInPrompt>
                  <a href="/login">Sign in</a> to subscribe
                </SignInPrompt>
              </>
            )}
          </PlanCard>
        ))}
      </PlansContainer>
    </PricingContainer>
  );
};

export default Pricing;
