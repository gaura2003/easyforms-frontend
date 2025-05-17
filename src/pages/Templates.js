import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const TemplatesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
`;

const SearchAndFilter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textLight};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    overflow-x: auto;
    padding-bottom: 10px;
  }
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.lightBg};
  }
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const TemplateCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const TemplatePreview = styled.div`
  height: 180px;
  background-color: ${props => props.theme.colors.lightBg};
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TemplateBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.pro ? props.theme.colors.primary : props.theme.colors.success};
  color: white;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
`;

const TemplateInfo = styled.div`
  padding: 20px;
`;

const TemplateName = styled.h3`
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const TemplateDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
`;

const TemplateFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TemplateCategory = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  background-color: ${props => props.theme.colors.lightBg};
  padding: 4px 8px;
  border-radius: 4px;
`;

const UseTemplateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    text-decoration: none;
    color: white;
  }
  
  &.disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled.div`
  font-size: 60px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 20px;
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 20px;
`;

const Templates = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample template data
  const templates = [
    {
      id: 1,
      name: 'Contact Form',
      description: 'A simple contact form with name, email, and message fields.',
      category: 'contact',
      image: 'https://via.placeholder.com/300x180',
      isPro: false
    },
    {
      id: 2,
      name: 'Job Application',
      description: 'Collect job applications with personal details, experience, and file uploads.',
      category: 'business',
      image: 'https://via.placeholder.com/300x180',
      isPro: true
    },
    {
      id: 3,
      name: 'Event Registration',
      description: 'Register attendees for your next event with custom fields and options.',
      category: 'events',
      image: 'https://via.placeholder.com/300x180',
      isPro: false
    },
    {
      id: 4,
      name: 'Customer Feedback',
      description: 'Gather feedback from customers with ratings and comments.',
      category: 'feedback',
      image: 'https://via.placeholder.com/300x180',
      isPro: false
    },
    {
      id: 5,
      name: 'Product Order Form',
      description: 'Allow customers to order products with quantity, options, and shipping details.',
      category: 'business',
      image: 'https://via.placeholder.com/300x180',
      isPro: true
    },
    {
      id: 6,
      name: 'Newsletter Signup',
      description: 'Simple newsletter subscription form with name and email fields.',
      category: 'marketing',
      image: 'https://via.placeholder.com/300x180',
      isPro: false
    },
    {
      id: 7,
      name: 'Survey Template',
      description: 'Comprehensive survey with multiple question types and logic.',
      category: 'feedback',
      image: 'https://via.placeholder.com/300x180',
      isPro: true
    },
    {
      id: 8,
      name: 'Appointment Booking',
      description: 'Let clients book appointments with date, time, and service selection.',
      category: 'business',
      image: 'https://via.placeholder.com/300x180',
      isPro: true
    },
    {
      id: 9,
      name: 'Bug Report',
      description: 'Collect bug reports with details, screenshots, and priority levels.',
      category: 'feedback',
      image: 'https://via.placeholder.com/300x180',
      isPro: false
    }
  ];
  
  // Filter templates based on search term and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeFilter === 'all' || template.category === activeFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Check if user can use pro templates
  const canUsePro = isAuthenticated && user && (user.subscription_tier === 'pro' || user.subscription_tier === 'enterprise');
  
  return (
    <TemplatesContainer>
      <Header>
        <Title>Form Templates</Title>
        <Subtitle>
          Start with a pre-built template to save time. Customize it to fit your needs.
        </Subtitle>
      </Header>
      
      <SearchAndFilter>
        <SearchBar>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search templates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        
        <FilterContainer>
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'contact'} 
            onClick={() => setActiveFilter('contact')}
          >
            Contact
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'business'} 
            onClick={() => setActiveFilter('business')}
          >
            Business
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'events'} 
            onClick={() => setActiveFilter('events')}
          >
            Events
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'feedback'} 
            onClick={() => setActiveFilter('feedback')}
          >
            Feedback
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'marketing'} 
            onClick={() => setActiveFilter('marketing')}
          >
            Marketing
          </FilterButton>
        </FilterContainer>
      </SearchAndFilter>
      
      {filteredTemplates.length > 0 ? (
        <TemplatesGrid>
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id}>
              <TemplatePreview>
                <img src={template.image} alt={template.name} />
                            {template.isPro && (
                  <TemplateBadge pro={true}>PRO</TemplateBadge>
                )}
              </TemplatePreview>
              <TemplateInfo>
                <TemplateName>{template.name}</TemplateName>
                <TemplateDescription>{template.description}</TemplateDescription>
                <TemplateFooter>
                  <TemplateCategory>{template.category.charAt(0).toUpperCase() + template.category.slice(1)}</TemplateCategory>
                  <UseTemplateButton 
                    to={`/forms/create?template=${template.id}`}
                    className={template.isPro && !canUsePro ? 'disabled' : ''}
                    title={template.isPro && !canUsePro ? 'Upgrade to Pro to use this template' : 'Use this template'}
                  >
                    <FiPlus /> Use Template
                  </UseTemplateButton>
                </TemplateFooter>
              </TemplateInfo>
            </TemplateCard>
          ))}
        </TemplatesGrid>
      ) : (
        <EmptyState>
          <EmptyStateIcon>🔍</EmptyStateIcon>
          <EmptyStateText>No templates found matching your search criteria.</EmptyStateText>
          <FilterButton onClick={() => {setSearchTerm(''); setActiveFilter('all');}}>
            Clear Filters
          </FilterButton>
        </EmptyState>
      )}
    </TemplatesContainer>
  );
};

export default Templates;

                  