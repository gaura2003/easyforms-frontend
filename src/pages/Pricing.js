import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RazorpayCheckout from '../components/RazorpayCheckout';
import { FiCheck, FiX, FiInfo } from 'react-icons/fi';

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

const ComparisonTable = styled.div`
  margin-top: 60px;
  overflow-x: auto;
`;

const ComparisonTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: ${props => props.theme.colors.text};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  
  &:first-child {
    width: 250px;
  }
  
  &.plan-header {
    text-align: center;
    font-size: 18px;
    color: ${props => props.featured ? props.theme.colors.primary : props.theme.colors.text};
  }
`;

const Td = styled.td`
  padding: 15px;
  text-align: ${props => props.center ? 'center' : 'left'};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  
  &.feature-name {
    font-weight: 500;
  }
  
  &.feature-value {
    text-align: center;
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  svg {
    color: ${props => props.included ? props.theme.colors.success : props.theme.colors.danger};
  }
`;

const FeatureTooltip = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  
  svg {
    margin-left: 5px;
    color: ${props => props.theme.colors.textLight};
    cursor: help;
  }
  
  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: 200px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
  font-weight: normal;
  
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
`;

const FAQSection = styled.div`
  margin-top: 60px;
`;

const FAQTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: ${props => props.theme.colors.text};
`;

const FAQItem = styled.div`
  margin-bottom: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const FAQQuestion = styled.div`
  padding: 15px 20px;
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const FAQAnswer = styled.div`
  padding: ${props => props.open ? '15px 20px' : '0 20px'};
  max-height: ${props => props.open ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  color: ${props => props.theme.colors.textLight};
  border-top: ${props => props.open ? `1px solid ${props.theme.colors.border}` : 'none'};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  &:after {
    content: " ";
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 6px solid ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary} transparent;
    animation: spinner 1.2s linear infinite;
  }
  
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [interval, setInterval] = useState('monthly');
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscription-plans/compare`);
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
  
  const handleFreePlanClick = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }
    
    if (isCurrentPlan('free')) {
      return;
    }
    
    try {
      // Downgrade to free plan
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions/downgrade`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      alert('You have successfully switched to the Free plan.');
      window.location.reload();
    } catch (error) {
      console.error('Error downgrading to free plan:', error);
      alert('Failed to switch to Free plan. Please try again.');
    }
  };
  
  const toggleFAQ = (index) => {
    if (openFAQ === index) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(index);
    }
  };
  
  const faqs = [
    {
      question: 'How do I upgrade my subscription?',
      answer: 'You can upgrade your subscription at any time by selecting a plan on this page and completing the payment process. Your new plan will be activated immediately.'
    },
    {
      question: 'Can I downgrade my subscription?',
      answer: 'Yes, you can downgrade to a lower tier plan or the free plan at any time. Your current plan benefits will remain active until the end of your billing period.'
    },
    {
      question: 'How are form submissions counted?',
      answer: 'Each time someone submits data through one of your forms, it counts as one submission. The monthly submission limit resets at the beginning of each billing cycle.'
    },
    {
      question: 'What happens if I reach my submission limit?',
      answer: 'If you reach your monthly submission limit, new submissions will be blocked until your limit resets or you upgrade to a higher tier plan.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 14-day money-back guarantee for all paid plans. If you\'re not satisfied with our service, contact our support team within 14 days of your purchase for a full refund.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards and net banking through our secure payment processor, Razorpay.'
    }
  ];
  
  if (loading) {
    return (
      <PricingContainer>
        <Title>Simple, Transparent Pricing</Title>
        <LoadingSpinner />
      </PricingContainer>
    );
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
              ${interval === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
              <span>/{interval === 'monthly' ? 'month' : 'year'}</span>
            </PlanPrice>
            
            <PlanDescription>{getPlanDescription(plan.name)}</PlanDescription>
            
            <FeaturesList>
              <Feature included={true}>
                <FiCheck /> <strong>{plan.features.formLimit}</strong> forms
              </Feature>
              <Feature included={true}>
                <FiCheck /> <strong>{plan.features.submissionLimit.toLocaleString()}</strong> submissions/month
              </Feature>
              <Feature included={plan.features.customRedirect}>
                {plan.features.customRedirect ? <FiCheck /> : <FiX />} Custom redirect URLs
              </Feature>
              <Feature included={plan.features.fileUploads}>
                {plan.features.fileUploads ? <FiCheck /> : <FiX />} File uploads
              </Feature>
              <Feature included={plan.features.prioritySupport}>
                {plan.features.prioritySupport ? <FiCheck /> : <FiX />} Priority support
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
                plan.name === 'free' ? (
                  <SubscribeButton onClick={handleFreePlanClick}>
                    Switch to Free Plan
                  </SubscribeButton>
                ) : (
                  <RazorpayCheckout plan={plan} interval={interval} />
                )
              )
            ) : (
              <>
                <SubscribeButton onClick={() => navigate('/login', { state: { from: '/pricing' } })}>
                  Sign in to Subscribe
                </SubscribeButton>
              </>
            )}
          </PlanCard>
        ))}
      </PlansContainer>
      
      <ComparisonTable>
        <ComparisonTitle>Feature Comparison</ComparisonTitle>
        <Table>
          <thead>
            <tr>
              <Th>Feature</Th>
              {plans.map(plan => (
                <Th key={plan.id} className="plan-header" featured={plan.name === 'pro'}>
                  {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="feature-name">
                <FeatureTooltip>
                  Number of Forms
                  <FiInfo />
                  <TooltipText className="tooltip-text">
                    Maximum number of forms you can create with this plan
                  </TooltipText>
                </FeatureTooltip>
              </Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  {plan.features.formLimit}
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">
                <FeatureTooltip>
                  Monthly Submissions
                  <FiInfo />
                  <TooltipText className="tooltip-text">
                    Maximum number of form submissions you can receive per month
                  </TooltipText>
                </FeatureTooltip>
              </Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  {plan.features.submissionLimit.toLocaleString()}
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">Custom Redirect URLs</Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  <FeatureIcon included={plan.features.customRedirect}>
                    {plan.features.customRedirect ? <FiCheck /> : <FiX />}
                  </FeatureIcon>
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">File Uploads</Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  <FeatureIcon included={plan.features.fileUploads}>
                    {plan.features.fileUploads ? <FiCheck /> : <FiX />}
                  </FeatureIcon>
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">Priority Support</Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  <FeatureIcon included={plan.features.prioritySupport}>
                    {plan.features.prioritySupport ? <FiCheck /> : <FiX />}
                  </FeatureIcon>
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">Remove EasyForms Branding</Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  <FeatureIcon included={plan.name !== 'free'}>
                    {plan.name !== 'free' ? <FiCheck /> : <FiX />}
                  </FeatureIcon>
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">Dedicated Account Manager</Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  <FeatureIcon included={plan.name === 'enterprise'}>
                    {plan.name === 'enterprise' ? <FiCheck /> : <FiX />}
                  </FeatureIcon>
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">Data Export (CSV/Excel)</Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  <FeatureIcon included={true}>
                    <FiCheck />
                  </FeatureIcon>
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">Spam Protection</Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  <FeatureIcon included={true}>
                    <FiCheck />
                  </FeatureIcon>
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">Email Notifications</Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  <FeatureIcon included={true}>
                    <FiCheck />
                  </FeatureIcon>
                </Td>
              ))}
            </tr>
            <tr>
              <Td className="feature-name">Basic Analytics</Td>
              {plans.map(plan => (
                <Td key={plan.id} className="feature-value">
                  <FeatureIcon included={true}>
                    <FiCheck />
                  </FeatureIcon>
                </Td>
              ))}
            </tr>
            <tr>
              <Td></Td>
              {plans.map(plan => (
                <Td key={plan.id} center>
                  {isAuthenticated ? (
                    isCurrentPlan(plan.name) ? (
                      <CurrentPlanBadge>Current Plan</CurrentPlanBadge>
                    ) : (
                      plan.name === 'free' ? (
                        <SubscribeButton onClick={handleFreePlanClick}>
                          Switch to Free
                        </SubscribeButton>
                      ) : (
                        <RazorpayCheckout plan={plan} interval={interval} />
                      )
                    )
                  ) : (
                    <SubscribeButton onClick={() => navigate('/login', { state: { from: '/pricing' } })}>
                      Sign in
                    </SubscribeButton>
                  )}
                </Td>
              ))}
            </tr>
          </tbody>
        </Table>
      </ComparisonTable>
      
      <FAQSection>
        <FAQTitle>Frequently Asked Questions</FAQTitle>
        {faqs.map((faq, index) => (
          <FAQItem key={index}>
            <FAQQuestion onClick={() => toggleFAQ(index)}>
              {faq.question}
              {openFAQ === index ? '−' : '+'}
            </FAQQuestion>
            <FAQAnswer open={openFAQ === index}>
              {faq.answer}
            </FAQAnswer>
          </FAQItem>
        ))}
      </FAQSection>
    </PricingContainer>
  );
};

export default Pricing;
