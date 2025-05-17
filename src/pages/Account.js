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
  margin-right: 10px;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &.danger {
    background-color: ${props => props.theme.colors.danger};
    
    &:hover {
      background-color: ${props => props.theme.colors.dangerDark};
    }
  }
  
  &.secondary {
    background-color: #6c757d;
    
    &:hover {
      background-color: #5a6268;
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

const PlanCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s;
  cursor: pointer;
  
  ${props => props.selected && `
    border-color: ${props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props.theme.colors.primary}40;
  `}
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const PlanTitle = styled.h3`
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const PlanPrice = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
  
  span {
    font-size: 16px;
    color: #666;
  }
`;

const PlanFeatures = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
  
  li {
    margin-bottom: 8px;
    
    &:before {
      content: "✓";
      color: ${props => props.theme.colors.primary};
      margin-right: 8px;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.active ? '600' : '400'};
`;

const PaymentMethodForm = styled.div`
  margin-top: 20px;
`;

const Account = () => {
  const { user, token, updateUser, subscribeToPlan, cancelSubscription, addPaymentMethod } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
    
    const fetchData = async () => {
      try {
        // Fetch subscription data
        const subResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setSubscription(subResponse.data.subscription);
        
        // Fetch available plans
        const plansResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscription-plans`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setPlans(plansResponse.data.plans);
        
        // Fetch payment methods
        const paymentResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/payment-methods`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setPaymentMethods(paymentResponse.data.paymentMethods);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
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
        const result = await cancelSubscription();
        
        if (result.success) {
          // Update subscription state
          setSubscription({
            ...subscription,
            tier: 'free',
            status: 'cancelled',
            razorpaySubscription: null
          });
          
          alert('Subscription cancelled successfully');
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert('Failed to cancel subscription');
      }
    }
  };
  
  const handleSubscribe = async () => {
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }
    
    // If user has no payment methods and trying to subscribe to paid plan
    if (paymentMethods.length === 0 && selectedPlan.name !== 'free') {
      setShowAddPayment(true);
      return;
    }
    
    try {
      const defaultPaymentMethod = paymentMethods.find(pm => pm.is_default) || paymentMethods[0];
      const paymentMethodId = defaultPaymentMethod ? defaultPaymentMethod.id : null;
      
      const result = await subscribeToPlan(selectedPlan.id, billingCycle, paymentMethodId);
      
      if (result.success) {
        setSubscription(result.subscription);
        alert(`Successfully subscribed to ${selectedPlan.name} plan`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      alert('Failed to subscribe to plan');
    }
  };
  
  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      alert('Please fill in all card details');
      return;
    }
    
    try {
      // Format expiry date
      const [month, year] = cardExpiry.split('/');
      
      const paymentDetails = {
        cardNumber,
        expiryMonth: month.trim(),
        expiryYear: year.trim(),
        cvc: cardCvc,
        cardholderName: cardName,
        setAsDefault: true
      };
      
      const result = await addPaymentMethod(paymentDetails);
      
      if (result.success) {
        setPaymentMethods([...paymentMethods, result.paymentMethod]);
        setShowAddPayment(false);
        
        // Clear form
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
        setCardName('');
        
        alert('Payment method added successfully');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      alert('Failed to add payment method');
    }
  };
  
  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiry = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    } else {
      return digits;
    }
  };
  
  if (loading) {
    return <AccountContainer>Loading...</AccountContainer>;
  }
  
  return (
    <AccountContainer>
      <Title>Account Settings</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </Tab>
        <Tab 
          active={activeTab === 'subscription'} 
          onClick={() => setActiveTab('subscription')}
        >
          Subscription
        </Tab>
        <Tab 
          active={activeTab === 'payment'} 
          onClick={() => setActiveTab('payment')}
        >
          Payment Methods
        </Tab>
      </TabContainer>
      
      {activeTab === 'profile' && (
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
      )}
      
      {activeTab === 'subscription' && (
        <>
          <Section>
            <SectionTitle>Current Subscription</SectionTitle>
            
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
                  
                  {subscription.billing_cycle && (
                    <InfoRow>
                      <strong>Billing Cycle:</strong>
                      <span>{subscription.billing_cycle.charAt(0).toUpperCase() + subscription.billing_cycle.slice(1)}</span>
                    </InfoRow>
                  )}
                  
                  {subscription.next_billing_date && (
                    <InfoRow>
                      <strong>Next Billing:</strong>
                      <span>
                        {new Date(subscription.next_billing_date).toLocaleDateString()}
                      </span>
                    </InfoRow>
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
          
          <Section>
            <SectionTitle>Available Plans</SectionTitle>
            
            <TabContainer>
              <Tab 
                active={billingCycle === 'monthly'} 
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </Tab>
              <Tab 
                active={billingCycle === 'yearly'} 
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly (Save 15%)
              </Tab>
            </TabContainer>
            
            <div>
              {plans.map(plan => (
                <PlanCard 
                  key={plan.id} 
                  selected={selectedPlan && selectedPlan.id === plan.id}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <PlanTitle>{plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}</PlanTitle>
                  <PlanPrice>
                    ${billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price}
                    <span>/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </PlanPrice>
                  
                  <PlanFeatures>
                    <li>{plan.form_limit} forms</li>
                    <li>{plan.submission_limit_monthly} submissions/month</li>
                    {plan.custom_redirect && <li>Custom redirect URLs</li>}
                    {plan.file_uploads && <li>File uploads</li>}
                    {plan.priority_support && <li>Priority support</li>}
                  </PlanFeatures>
                  
                  {subscription && subscription.tier === plan.name && subscription.status === 'active' ? (
                    <Button className="secondary" disabled>Current Plan</Button>
                  ) : (
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                      handleSubscribe();
                    }}>
                      {subscription && subscription.tier === 'free' && plan.name !== 'free' ? 'Upgrade' : 
                       subscription && subscription.tier !== 'free' && plan.name === 'free' ? 'Downgrade' :
                       subscription && subscription.tier !== plan.name ? 'Switch Plan' : 'Select'}
                    </Button>
                  )}
                </PlanCard>
              ))}
            </div>
          </Section>
        </>
      )}
      
      {activeTab === 'payment' && (
        <Section>
          <SectionTitle>Payment Methods</SectionTitle>
          
          {paymentMethods.length > 0 ? (
            <>
              {paymentMethods.map(method => (
                <div key={method.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{method.card_type}</strong> ending in {method.last_four}
                      {method.is_default && <span style={{ marginLeft: '10px', color: 'green' }}>Default</span>}
                    </div>
                    <div>
                      Expires {method.expiry_month}/{method.expiry_year}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button onClick={() => setShowAddPayment(true)}>Add Payment Method</Button>
            </>
          ) : (
            <>
              <p>You don't have any payment methods on file.</p>
              <Button onClick={() => setShowAddPayment(true)}>Add Payment Method</Button>
            </>
          )}
          
          {showAddPayment && (
            <PaymentMethodForm>
              <SectionTitle>Add Payment Method</SectionTitle>
              <form onSubmit={handleAddPaymentMethod}>
                <FormGroup>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    type="text"
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    type="text"
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </FormGroup>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                  <FormGroup style={{ flex: 1 }}>
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input
                      type="text"
                      id="cardExpiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </FormGroup>
                  
                  <FormGroup style={{ flex: 1 }}>
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      type="text"
                      id="cardCvc"
                      value={cardCvc}
                                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </FormGroup>
                </div>
                
                <div style={{ marginTop: '20px' }}>
                  <Button type="submit">Save Payment Method</Button>
                  <Button 
                    type="button" 
                    className="secondary" 
                    onClick={() => setShowAddPayment(false)}
                    style={{ marginLeft: '10px' }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </PaymentMethodForm>
          )}
        </Section>
      )}
    </AccountContainer>
  );
};

export default Account;


