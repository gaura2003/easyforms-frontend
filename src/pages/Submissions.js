import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiArrowLeft, FiEye, FiTrash2, FiDownload, FiFilter, FiRefreshCw } from 'react-icons/fi';

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

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterButton = styled(Button)`
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.secondary};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.secondaryDark};
  }
`;

const SubmissionsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: ${props => props.theme.colors.lightBg};
  border-radius: 8px;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const FilterRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const FilterField = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 500;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  word-break: break-word;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const PageButtons = styled.div`
  display: flex;
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

const PageInfo = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 14px;
`;

const PerPageSelect = styled.select`
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  margin-left: 10px;
`;

const Submissions = () => {
  const { formId } = useParams();
  const { token, } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  
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
        
        // Fetch submissions with filters
        fetchSubmissions();
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/dashboard');
      }
    };
    
    fetchData();
  }, [formId, token, navigate, page, perPage]);
  
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page,
        perPage,
        ...filters
      });
      
      const submissionsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms/${formId}/submissions?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSubmissions(submissionsResponse.data.submissions);
      setTotalPages(submissionsResponse.data.totalPages);
      setTotalSubmissions(submissionsResponse.data.totalSubmissions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };
  
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
        setTotalSubmissions(totalSubmissions - 1);
        
        // If we deleted the last item on the page, go to previous page
        if (submissions.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          // Otherwise just refresh the current page
          fetchSubmissions();
        }
      } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Failed to delete submission');
      }
    }
  };
  
  const exportToCsv = async () => {
    try {
      // Include filters in export
      const params = new URLSearchParams(filters);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/forms/${formId}/submissions/export?${params}`,
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
      link.setAttribute('download', `${form.name || form.title || 'form'}-submissions.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting submissions:', error);
      alert('Failed to export submissions');
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const applyFilters = () => {
    setPage(1); // Reset to first page when applying filters
    fetchSubmissions();
  };
  
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      searchTerm: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    setPage(1);
    // Fetch with reset filters
    setTimeout(fetchSubmissions, 0);
  };
  
  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1); // Reset to first page when changing items per page
  };
  
  if (loading && !form) {
    return <Container>Loading...</Container>;
  }
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          <FiArrowLeft size={20} />
        </BackButton>
        <Title>{form?.name || form?.title || `Form #${formId}`} - Submissions</Title>
        <ActionButtons>
          <FilterButton 
            active={showFilters} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> Filters
          </FilterButton>
          {submissions.length > 0 && (
            <Button onClick={exportToCsv}>
              <FiDownload /> Export to CSV
            </Button>
          )}
        </ActionButtons>
      </Header>
      
      <SubmissionsContainer>
        <FilterContainer visible={showFilters}>
          <FilterRow>
            <FilterField>
              <FilterLabel htmlFor="dateFrom">Date From</FilterLabel>
              <FilterInput 
                type="date" 
                id="dateFrom" 
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </FilterField>
            
            <FilterField>
              <FilterLabel htmlFor="dateTo">Date To</FilterLabel>
                            <FilterInput 
                type="date" 
                id="dateTo" 
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </FilterField>
            
            <FilterField>
              <FilterLabel htmlFor="searchTerm">Search</FilterLabel>
              <FilterInput 
                type="text" 
                id="searchTerm" 
                name="searchTerm"
                placeholder="Search in submission data..."
                value={filters.searchTerm}
                onChange={handleFilterChange}
              />
            </FilterField>
          </FilterRow>
          
          <FilterRow>
            <FilterField>
              <FilterLabel htmlFor="sortBy">Sort By</FilterLabel>
              <FilterSelect 
                id="sortBy" 
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="created_at">Date</option>
                <option value="ip_address">IP Address</option>
              </FilterSelect>
            </FilterField>
            
            <FilterField>
              <FilterLabel htmlFor="sortOrder">Order</FilterLabel>
              <FilterSelect 
                id="sortOrder" 
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </FilterSelect>
            </FilterField>
          </FilterRow>
          
          <FilterActions>
            <Button onClick={resetFilters}>
              <FiRefreshCw /> Reset
            </Button>
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
          </FilterActions>
        </FilterContainer>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading submissions...</div>
        ) : submissions.length > 0 ? (
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
                    <Td>{submission.ip_address || 'N/A'}</Td>
                    <Td>
                      {Object.keys(typeof submission.data === 'string' 
                        ? JSON.parse(submission.data) 
                        : submission.data).length} fields
                    </Td>
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
            
            <Pagination>
              <PageInfo>
                Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, totalSubmissions)} of {totalSubmissions} submissions
              </PageInfo>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Show:</span>
                <PerPageSelect value={perPage} onChange={handlePerPageChange}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </PerPageSelect>
              </div>
              
              <PageButtons>
                <PageButton 
                  onClick={() => setPage(page - 1)} 
                  disabled={page === 1}
                >
                  Previous
                </PageButton>
                
                {/* Show limited page numbers with ellipsis for large page counts */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logic to show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <PageButton 
                      key={pageNum} 
                      active={page === pageNum}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </PageButton>
                  );
                })}
                
                {totalPages > 5 && page < totalPages - 2 && (
                  <>
                    <span style={{ margin: '0 5px' }}>...</span>
                    <PageButton 
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </PageButton>
                  </>
                )}
                
                <PageButton 
                  onClick={() => setPage(page + 1)} 
                  disabled={page === totalPages}
                >
                  Next
                </PageButton>
              </PageButtons>
            </Pagination>
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
                <DetailValue>{selectedSubmission.ip_address || 'N/A'}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>User Agent</DetailLabel>
                <DetailValue>{selectedSubmission.user_agent || 'N/A'}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Referrer</DetailLabel>
                <DetailValue>{selectedSubmission.referrer || 'N/A'}</DetailValue>
              </DetailItem>
              
              <DetailLabel>Form Data</DetailLabel>
              {Object.entries(typeof selectedSubmission.data === 'string' 
                ? JSON.parse(selectedSubmission.data) 
                : selectedSubmission.data).map(([key, value]) => (
                <DetailItem key={key}>
                  <DetailLabel>{key}</DetailLabel>
                  <DetailValue>
                    {typeof value === 'object' 
                      ? JSON.stringify(value, null, 2) 
                      : value === '' ? '(empty)' : value}
                  </DetailValue>
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
