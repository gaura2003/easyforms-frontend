import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AccountContainer = styled.div`
  max-width: 800px;
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
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
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
  
  &.danger {
    background-color: ${props => props.theme.colors.danger};
    
    &:hover {
      background-color: ${props => props.theme.colors.dangerDark};
    }
  }
`;

const SubscriptionInfo = styled.div`
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  strong {
    width: 150px;
  }
`;

const Account = () => {
  const { user, token, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
    
    const fetchSubscription = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setSubscription(response.data.subscription);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, [user, token]);
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/users/profile`,
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      updateUser(response.data.user);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };
  
  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Update subscription state
        setSubscription({
          ...subscription,
          tier: 'free',
          status: 'cancelled',
          razorpaySubscription: null
        });
        
        // Update user context
        updateUser({ subscription_tier: 'free' });
        
        alert('Subscription cancelled successfully');
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert('Failed to cancel subscription');
      }
    }
  };
  
  if (loading) {
    return <AccountContainer>Loading...</AccountContainer>;
  }
  
  return (
    <AccountContainer>
      <Title>Account Settings</Title>
      
      <Section>
        <SectionTitle>Profile Information</SectionTitle>
        <form onSubmit={handleProfileUpdate}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          
          <Button type="submit">Update Profile</Button>
        </form>
      </Section>
      
      <Section>
        <SectionTitle>Subscription</SectionTitle>
        
        {subscription && (
          <>
            <SubscriptionInfo>
              <InfoRow>
                <strong>Current Plan:</strong>
                <span>{subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}</span>
              </InfoRow>
              
              <InfoRow>
                <strong>Status:</strong>
                <span>{subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}</span>
              </InfoRow>
              
              {subscription.razorpaySubscription && (
                <>
                  <InfoRow>
                    <strong>Next Billing:</strong>
                    <span>
                      {new Date(subscription.razorpaySubscription.current_end * 1000).toLocaleDateString()}
                    </span>
                  </InfoRow>
                </>
              )}
            </SubscriptionInfo>
            
            {subscription.tier !== 'free' && subscription.status === 'active' && (
              <Button className="danger" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
            )}
          </>
        )}
      </Section>
    </AccountContainer>
  );
};

export default Account;