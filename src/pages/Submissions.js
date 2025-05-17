import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiArrowLeft, FiEye, FiTrash2, FiDownload } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  margin-right: 15px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex-grow: 1;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.secondaryDark};
  }
`;

const SubmissionsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const SubmissionDetail = styled.div`
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  margin-bottom: 15px;
`;

const DetailLabel = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const DetailValue = styled.div`
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  white-space: pre-wrap;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryDark : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Submissions = () => {
  const { formId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch form details
        const formResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms/${formId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setForm(formResponse.data.form);
        
        // Fetch submissions
        const submissionsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms/${formId}/submissions?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setSubmissions(submissionsResponse.data.submissions);
        setTotalPages(submissionsResponse.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/dashboard');
      }
    };
    
    fetchData();
  }, [formId, token, navigate, page]);
  
  const handleDeleteSubmission = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms/${formId}/submissions/${submissionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Update submissions list
        setSubmissions(submissions.filter(sub => sub.id !== submissionId));
      } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Failed to delete submission');
      }
    }
  };
  
  const exportToCsv = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms/${formId}/submissions/export`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${form.name}-submissions.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting submissions:', error);
      alert('Failed to export submissions');
    }
  };
  
  if (loading) {
    return <Container>Loading...</Container>;
  }
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          <FiArrowLeft size={20} />
        </BackButton>
        <Title>{form.name} - Submissions</Title>
        {submissions.length > 0 && (
          <ExportButton onClick={exportToCsv}>
            <FiDownload /> Export to CSV
          </ExportButton>
        )}
      </Header>
      
      <SubmissionsContainer>
        {submissions.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>IP Address</Th>
                  <Th>Fields</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(submission => (
                  <tr key={submission.id}>
                    <Td>{new Date(submission.created_at).toLocaleString()}</Td>
                    <Td>{submission.ip_address}</Td>
                    <Td>{Object.keys(JSON.parse(submission.data)).length} fields</Td>
                    <Td>
                      <ActionButton onClick={() => setSelectedSubmission(submission)}>
                        <FiEye />
                      </ActionButton>
                      <ActionButton 
                        className="delete" 
                        onClick={() => handleDeleteSubmission(submission.id)}
                      >
                        <FiTrash2 />
                      </ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {totalPages > 1 && (
              <Pagination>
                <PageButton 
                  onClick={() => setPage(page - 1)} 
                  disabled={page === 1}
                >
                  Previous
                </PageButton>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PageButton 
                    key={i} 
                    active={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PageButton>
                ))}
                
                <PageButton 
                  onClick={() => setPage(page + 1)} 
                  disabled={page === totalPages}
                >
                  Next
                </PageButton>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState>
            <p>No submissions yet for this form.</p>
            <p>Once your form receives submissions, they will appear here.</p>
          </EmptyState>
        )}
      </SubmissionsContainer>
      
      {selectedSubmission && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Submission Details</ModalTitle>
              <CloseButton onClick={() => setSelectedSubmission(null)}>×</CloseButton>
            </ModalHeader>
            
            <SubmissionDetail>
              <DetailItem>
                <DetailLabel>Date</DetailLabel>
                <DetailValue>{new Date(selectedSubmission.created_at).toLocaleString()}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>IP Address</DetailLabel>
                <DetailValue>{selectedSubmission.ip_address}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>User Agent</DetailLabel>
                <DetailValue>{selectedSubmission.user_agent}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Referrer</DetailLabel>
                <DetailValue>{selectedSubmission.referrer || 'N/A'}</DetailValue>
              </DetailItem>
              
              <DetailLabel>Form Data</DetailLabel>
              {Object.entries(JSON.parse(selectedSubmission.data)).map(([key, value]) => (
                <DetailItem key={key}>
                  <DetailLabel>{key}</DetailLabel>
                  <DetailValue>{typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</DetailValue>
                </DetailItem>
              ))}
            </SubmissionDetail>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Submissions;
