import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiDownload, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import RazorpayCheckout from '../components/RazorpayCheckout';

const BillingContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  margin-bottom: 30px;
  color: ${props => props.theme.colors.text};
`;

const Section = styled.section`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
  font-size: 20px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const SubscriptionInfo = styled.div`
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const InfoLabel = styled.div`
  width: 200px;
  font-weight: 500;
  color: ${props => props.theme.colors.textLight};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
    margin-bottom: 5px;
  }
`;

const InfoValue = styled.div`
  flex: 1;
  color: ${props => props.theme.colors.text};
  
  &.highlight {
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
  }
  
  &.warning {
    color: ${props => props.theme.colors.warning};
  }
  
  &.danger {
    color: ${props => props.theme.colors.danger};
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => {
    switch(props.status) {
      case 'active': return props.theme.colors.success + '20';
      case 'cancelled': return props.theme.colors.danger + '20';
      case 'pending': return props.theme.colors.warning + '20';
      default: return props.theme.colors.textLight + '20';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'active': return props.theme.colors.success;
      case 'cancelled': return props.theme.colors.danger;
      case 'pending': return props.theme.colors.warning;
      default: return props.theme.colors.textLight;
    }
  }};
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;

  svg {
    margin-left: 8px;
  }

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &.secondary {
    background-color: white;
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};
    
    &:hover {
      background-color: ${props => props.theme.colors.lightBg};
    }
  }
  
  &.danger {
    background-color: ${props => props.theme.colors.danger};
    
    &:hover {
      background-color: ${props => props.theme.colors.dangerDark};
    }
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.colors.textLight};
`;

const Alert = styled.div`
  background-color: ${props => props.theme.colors.warning}20;
  border-left: 4px solid ${props => props.theme.colors.warning};
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  svg {
    color: ${props => props.theme.colors.warning};
    margin-right: 10px;
    flex-shrink: 0;
  }
`;

const AlertText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const PlanCard = styled.div`
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  background-color: ${props => props.active ? props.theme.colors.primary + '10' : 'white'};
  position: relative;
  
  ${props => props.active && `
    &::after {
      content: 'Current Plan';
      position: absolute;
      top: -12px;
      right: 10px;
      background-color: ${props.theme.colors.primary};
      color: white;
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 500;
    }
  `}
`;

const PlanName = styled.h3`
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const PlanPrice = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.primary};
  
  span {
    font-size: 14px;
    font-weight: normal;
    color: ${props => props.theme.colors.textLight};
  }
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
`;

const PlanFeature = styled.li`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  
  &:before {
    content: '✓';
    color: ${props => props.theme.colors.success};
    margin-right: 8px;
  }
`;

const Billing = () => {
  const { token, user, updateUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingInterval, setBillingInterval] = useState('monthly');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subscription details
        const subscriptionResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setSubscription(subscriptionResponse.data.subscription);
        
        // Fetch payment history
        const paymentsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/payments`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setPayments(paymentsResponse.data.payments || []);
        
        // Fetch available plans
        const plansResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions/plans`
        );
        
        setPlans(plansResponse.data.plans || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching billing data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);
  
    // Function to handle cancellation of subscription
  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions/cancel`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Update subscription state
        setSubscription({
          ...subscription,
          status: 'cancelled'
        });
        
        // Update user context
        updateUser({
          ...user,
          subscription_status: 'cancelled'
        });
        
        alert('Subscription cancelled successfully');
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert('Failed to cancel subscription');
      }
    }
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Function to format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  // Helper function to safely capitalize first letter
  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  
  if (loading) {
    return <BillingContainer>Loading billing information...</BillingContainer>;
  }
  
  
  return (
    <BillingContainer>
      <Title>Billing & Subscription</Title>
      
      <Section>
        <SectionTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4z"></path>
            <line x1="12" y1="9" x2="12" y2="15"></line>
            <line x1="9" y1="12" x2="15" y2="12"></line>
          </svg>
          Current Subscription
        </SectionTitle>
        
        <SubscriptionInfo>
          <InfoRow>
            <InfoLabel>Plan</InfoLabel>
            <InfoValue className="highlight">
              {user?.subscription_tier 
                ? `${capitalizeFirst(user.subscription_tier)} Plan` 
                : 'Free Plan'}
            </InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Status</InfoLabel>
            <InfoValue>
              <StatusBadge status={user?.subscription_status || 'none'}>
                {user?.subscription_status 
                  ? capitalizeFirst(user.subscription_status)
                  : 'None'}
              </StatusBadge>
            </InfoValue>
          </InfoRow>
          
          {user?.subscription_status === 'active' && subscription && (
            <>
              <InfoRow>
                <InfoLabel>Billing Cycle</InfoLabel>
                <InfoValue>
                  {subscription?.billing_cycle
                    ? capitalizeFirst(subscription.billing_cycle)
                    : 'Monthly'}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>Next Billing Date</InfoLabel>
                <InfoValue>
                  {subscription?.end_date 
                    ? formatDate(subscription.end_date)
                    : 'N/A'}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>Amount</InfoLabel>
                <InfoValue>
                  {subscription?.billing_cycle === 'monthly'
                    ? formatCurrency(plans.find(p => p?.name === user?.subscription_tier)?.monthly_price || 0)
                    : formatCurrency(plans.find(p => p?.name === user?.subscription_tier)?.yearly_price || 0)}
                  <span> / {subscription?.billing_cycle === 'monthly' ? 'month' : 'year'}</span>
                </InfoValue>
              </InfoRow>
            </>
          )}
        </SubscriptionInfo>
        
        {user?.subscription_status === 'active' && (
          <ButtonGroup>
            <Button className="danger" onClick={handleCancelSubscription}>
              Cancel Subscription
            </Button>
          </ButtonGroup>
        )}
        
        {user?.subscription_status !== 'active' && (
          <>
            <SectionTitle>Upgrade Your Plan</SectionTitle>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <button 
                    style={{ 
                      padding: '8px 16px', 
                      background: billingInterval === 'monthly' ? '#f5f5f5' : 'white',
                      border: 'none',
                      borderRight: '1px solid #ddd',
                      cursor: 'pointer'
                    }}
                    onClick={() => setBillingInterval('monthly')}
                  >
                    Monthly
                  </button>
                  <button 
                    style={{ 
                      padding: '8px 16px', 
                      background: billingInterval === 'yearly' ? '#f5f5f5' : 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onClick={() => setBillingInterval('yearly')}
                  >
                    Yearly <span style={{ marginLeft: '5px', fontSize: '12px', color: 'green', fontWeight: 'bold' }}>Save 20%</span>
                  </button>
                </div>
              </div>
              
              <PlansContainer>
                {plans.map(plan => plan && (
                  <PlanCard 
                    key={plan.id} 
                    active={user?.subscription_tier === plan.name}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <PlanName>{plan.name ? capitalizeFirst(plan.name) : 'Unknown'}</PlanName>
                    <PlanPrice>
                      {billingInterval === 'monthly' 
                        ? formatCurrency(plan.monthly_price || 0)
                        : formatCurrency(plan.yearly_price || 0)}
                      <span>/{billingInterval === 'monthly' ? 'month' : 'year'}</span>
                    </PlanPrice>
                    
                    <PlanFeatures>
                      <PlanFeature>{plan.form_limit || 0} forms</PlanFeature>
                      <PlanFeature>{(plan.submission_limit_monthly || 0).toLocaleString()} submissions/month</PlanFeature>
                      {plan.custom_redirect && <PlanFeature>Custom redirect URLs</PlanFeature>}
                      {plan.file_uploads && <PlanFeature>File uploads</PlanFeature>}
                      {plan.priority_support && <PlanFeature>Priority support</PlanFeature>}
                    </PlanFeatures>
                    
                    {plan.name && plan.name !== 'free' && plan.name !== user?.subscription_tier && (
                      <RazorpayCheckout plan={plan} interval={billingInterval} />
                    )}
                    
                    {plan.name === 'free' && user?.subscription_tier !== 'free' && (
                      <Button 
                        className="secondary"
                        onClick={handleCancelSubscription}
                      >
                        Downgrade to Free
                      </Button>
                    )}
                    
                    {plan.name === user?.subscription_tier && (
                      <Button disabled>Current Plan</Button>
                    )}
                  </PlanCard>
                ))}
              </PlansContainer>
            </div>
          </>
        )}
      </Section>
      
      <Section>
        <SectionTitle>
          <FiCreditCard />
          Payment Methods
        </SectionTitle>
        
        {/* This would be implemented with actual payment method management */}
        <EmptyState>
          No payment methods available.
        </EmptyState>
      </Section>
      
      <Section>
        <SectionTitle>
          <FiDownload />
          Billing History
        </SectionTitle>
        
        {payments && payments.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Invoice</Th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => payment && (
                <tr key={payment.id}>
                  <Td>{formatDate(payment.created_at)}</Td>
                  <Td>
                    {payment.description || (user?.subscription_tier 
                      ? `${capitalizeFirst(user.subscription_tier)} Plan Subscription`
                      : 'Plan Subscription')}
                  </Td>
                  <Td>{formatCurrency(payment.amount || 0, payment.currency || 'USD')}</Td>
                  <Td>
                    <StatusBadge status={payment.status || 'unknown'}>
                      {payment.status ? capitalizeFirst(payment.status) : 'Unknown'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {payment.status === 'completed' && (
                      <Button className="secondary" size="small">
                        <FiDownload /> Invoice
                      </Button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            No billing history available.
          </EmptyState>
        )}
      </Section>
    </BillingContainer>
  );
};

export default Billing;