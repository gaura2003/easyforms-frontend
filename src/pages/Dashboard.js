import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiBarChart2, FiCopy } from 'react-icons/fi';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
`;

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const StatTitle = styled.h3`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const SubscriptionInfo = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 40px;
`;

const SubscriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SubscriptionTitle = styled.h2`
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;

const UpgradeButton = styled(Link)`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondaryDark};
  }
`;

const UsageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const UsageItem = styled.div`
  margin-bottom: 10px;
`;

const UsageLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  
  span {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background-color: ${props => 
    props.percentage > 90 
      ? props.theme.colors.danger 
      : props.percentage > 70 
        ? props.theme.colors.warning 
        : props.theme.colors.success};
  border-radius: 4px;
`;

const FormsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
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

const EndpointCell = styled.div`
  display: flex;
  align-items: center;
  
  code {
    background-color: ${props => props.theme.colors.lightBg};
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  button {
    background: none;
    border: none;
    color: ${props => props.theme.colors.primary};
    cursor: pointer;
    margin-left: 8px;
    
    &:hover {
      color: ${props => props.theme.colors.primaryDark};
    }
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
  
  &.delete {
    color: ${props => props.theme.colors.danger};
    
    &:hover {
      color: ${props => props.theme.colors.dangerDark};
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.textLight};
`;

const Dashboard = () => {
  const { token } = useAuth();
  const [forms, setForms] = useState([]);
  const [stats, setStats] = useState({
    overview: {
      totalForms: 0,
      totalSubmissions: 0,
      currentMonthSubmissions: 0,
      subscriptionTier: 'free',
      formLimit: 3,
      submissionLimitMonthly: 100,
      formUsagePercentage: 0,
      submissionUsagePercentage: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch forms
        const formsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setForms(formsResponse.data.forms);
        
        // Fetch stats
        const statsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setStats(statsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);
  
  const handleDeleteForm = async (formId) => {
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
        
        // Update forms list
        setForms(forms.filter(form => form.id !== formId));
        
        // Update stats
        setStats({
          ...stats,
          overview: {
            ...stats.overview,
            totalForms: stats.overview.totalForms - 1,
            formUsagePercentage: Math.round(((stats.overview.totalForms - 1) / stats.overview.formLimit) * 100)
          }
        });
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('Failed to delete form');
      }
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  const getFormDisplayName = (form) => {
    if (form.title && form.title.trim() !== '') {
      return form.title;
    } else if (form.name && form.name.trim() !== '') {
      return form.name;
    } else {
      return `Form #${form.id}`;
    }
  };
  
  if (loading) {
    return <DashboardContainer>Loading...</DashboardContainer>;
  }
  
  const { overview } = stats;
  
  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <CreateButton to="/forms/create">
          <FiPlus /> Create Form
        </CreateButton>
      </Header>
      
      <StatsContainer>
        <StatCard>
          <StatTitle>Total Forms</StatTitle>
          <StatValue>{overview.totalForms}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Total Submissions</StatTitle>
          <StatValue>{overview.totalSubmissions}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Submissions This Month</StatTitle>
          <StatValue>{overview.currentMonthSubmissions}</StatValue>
        </StatCard>
      </StatsContainer>
      
      <SubscriptionInfo>
        <SubscriptionHeader>
          <SubscriptionTitle>
            Your Plan: <strong style={{ textTransform: 'capitalize' }}>{overview.subscriptionTier}</strong>
          </SubscriptionTitle>
          {overview.subscriptionTier === 'free' && (
            <UpgradeButton to="/pricing">Upgrade Plan</UpgradeButton>
          )}
        </SubscriptionHeader>
        
        <UsageContainer>
          <UsageItem>
            <UsageLabel>
              <span>Forms</span>
              <span>{overview.totalForms} / {overview.formLimit}</span>
            </UsageLabel>
            <ProgressBar>
              <Progress percentage={overview.formUsagePercentage} />
            </ProgressBar>
          </UsageItem>
          
          <UsageItem>
            <UsageLabel>
              <span>Monthly Submissions</span>
              <span>{overview.currentMonthSubmissions} / {overview.submissionLimitMonthly}</span>
            </UsageLabel>
            <ProgressBar>
              <Progress percentage={overview.submissionUsagePercentage} />
            </ProgressBar>
          </UsageItem>
        </UsageContainer>
      </SubscriptionInfo>
      
      <FormsContainer>
        <SectionTitle>Your Forms</SectionTitle>
        
        {forms.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Endpoint</Th>
                <Th>Submissions</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {forms.map(form => (
                <tr key={form.id}>
                  <Td>{getFormDisplayName(form)}</Td>
                  <Td>
                    <EndpointCell>
                      <code>{`${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/f/${form.endpoint_id}`}</code>
                      <button onClick={() => copyToClipboard(`${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/f/${form.endpoint_id}`)}>
                        <FiCopy title={copySuccess || "Copy to clipboard"} />
                      </button>
                    </EndpointCell>
                  </Td>
                  <Td>{form.submission_count || 0}</Td>
                  <Td>{new Date(form.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <ActionButton as={Link} to={`/forms/${form.id}`} title="Edit form">
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton as={Link} to={`/forms/${form.id}/submissions`} title="View submissions">
                      <FiEye />
                    </ActionButton>
                    <ActionButton as={Link} to={`/forms/${form.id}/analytics`} title="View analytics">
                      <FiBarChart2 />
                    </ActionButton>
                    <ActionButton 
                      className="delete" 
                      onClick={() => handleDeleteForm(form.id)}
                      title="Delete form"
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            <p>You haven't created any forms yet.</p>
            <CreateButton to="/forms/create" style={{ display: 'inline-flex', marginTop: '20px' }}>
              <FiPlus /> Create your first form
            </CreateButton>
          </EmptyState>
        )}
      </FormsContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
