import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch, FiChevronDown, FiChevronUp, FiMail, FiMessageSquare } from 'react-icons/fi';

const HelpContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.1rem;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 50px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px 15px 50px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 30px;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textLight};
`;

const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
`;

const CategoryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
  text-align: center;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CategoryIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.colors.lightBg};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  
  svg {
    width: 30px;
    height: 30px;
    color: ${props => props.theme.colors.primary};
  }
`;

const CategoryTitle = styled.h3`
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const CategoryDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 14px;
  margin-bottom: 15px;
`;

const CategoryLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FAQSection = styled.div`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 30px;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const FAQItem = styled.div`
  margin-bottom: 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const FAQQuestion = styled.button`
  width: 100%;
  text-align: left;
  padding: 20px;
  background-color: white;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.theme.colors.lightBg};
  }
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const FAQAnswer = styled.div`
  padding: ${props => props.isOpen ? '0 20px 20px' : '0 20px'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  color: ${props => props.theme.colors.textLight};
  line-height: 1.6;
`;

const ContactSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const ContactCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
`;

const ContactIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.colors.lightBg};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  
  svg {
    width: 30px;
    height: 30px;
    color: ${props => props.theme.colors.primary};
  }
`;

const ContactTitle = styled.h3`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const ContactDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 20px;
`;

const ContactButton = styled.a`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    text-decoration: none;
    color: white;
  }
`;

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
  const faqs = [
    {
      question: 'How do I create my first form?',
      answer: 'To create your first form, log in to your account and click on the "Create Form" button on your dashboard. You can then use our drag-and-drop builder to add fields, customize the design, and set up form behavior. Once you\'re done, save your form and you\'ll get a unique endpoint that you can embed on your website or share via link.'
    },
    {
      question: 'How do I embed a form on my website?',
      answer: 'After creating your form, go to the form details page and click on "Embed". You\'ll see HTML code that you can copy and paste into your website. Alternatively, you can use the direct form URL in an iframe or as a link. We also provide integrations with popular platforms like WordPress, Shopify, and Wix.'
    },
    {
      question: 'Can I customize the confirmation message after form submission?',
      answer: 'Yes! You can customize the confirmation message that appears after someone submits your form. Go to your form settings, find the "Confirmation" section, and enter your custom message. You can also set up a redirect to a thank you page on your website instead of showing a message.'
    },
    {
      question: 'How do I receive email notifications for new submissions?',
            answer: 'Email notifications are enabled by default for all forms. When someone submits your form, you\'ll receive an email with the submission details. You can customize notification settings in your form settings under the "Notifications" tab. You can add multiple recipients, customize the email subject, and even set up conditional notifications.'
    },
    {
      question: 'What\'s the difference between the Free, Pro, and Enterprise plans?',
      answer: 'The Free plan allows you to create up to 3 forms with 100 submissions per month. The Pro plan increases this to 20 forms and 5,000 submissions per month, plus adds features like custom redirects and file uploads. The Enterprise plan offers 100 forms, 50,000 submissions per month, priority support, and a dedicated account manager. You can view a detailed comparison on our Pricing page.'
    },
    {
      question: 'How do I export my form submissions?',
      answer: 'To export your submissions, go to your form\'s submissions page and click the "Export" button. You can export all submissions as a CSV file that can be opened in Excel or Google Sheets. Pro and Enterprise users can also set up automatic exports to Google Sheets or via webhook to other services.'
    },
    {
      question: 'Is my form data secure?',
      answer: 'Yes, we take security seriously. All form submissions are encrypted in transit using HTTPS. We also store your data securely and never share it with third parties. We comply with GDPR and other privacy regulations. For forms that collect sensitive information, we recommend enabling our enhanced security features available on Pro and Enterprise plans.'
    },
    {
      question: 'How do I prevent spam submissions?',
      answer: 'EasyForms includes built-in spam protection on all plans. We use a combination of techniques to detect and block spam submissions. You can also enable CAPTCHA in your form settings for an extra layer of protection. Pro and Enterprise users get access to advanced spam filtering options and IP blocking capabilities.'
    }
  ];
  
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <HelpContainer>
      <Title>How can we help you?</Title>
      <Subtitle>Find answers to common questions or contact our support team</Subtitle>
      
      <SearchContainer>
        <SearchIcon>
          <FiSearch />
        </SearchIcon>
        <SearchInput 
          type="text" 
          placeholder="Search for help..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      <CategoriesContainer>
        <CategoryCard>
          <CategoryIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </CategoryIcon>
          <CategoryTitle>Getting Started</CategoryTitle>
          <CategoryDescription>
            Learn the basics of creating and managing forms with EasyForms
          </CategoryDescription>
          <CategoryLink href="/docs/getting-started">View Guides</CategoryLink>
        </CategoryCard>
        
        <CategoryCard>
          <CategoryIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </CategoryIcon>
          <CategoryTitle>Form Features</CategoryTitle>
          <CategoryDescription>
            Discover all the features and customization options for your forms
          </CategoryDescription>
          <CategoryLink href="/docs/features">Explore Features</CategoryLink>
        </CategoryCard>
        
        <CategoryCard>
          <CategoryIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </CategoryIcon>
          <CategoryTitle>Integrations</CategoryTitle>
          <CategoryDescription>
            Connect your forms with other tools and services you use
          </CategoryDescription>
          <CategoryLink href="/docs/integrations">View Integrations</CategoryLink>
        </CategoryCard>
        
        <CategoryCard>
          <CategoryIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </CategoryIcon>
          <CategoryTitle>Account & Billing</CategoryTitle>
          <CategoryDescription>
            Manage your account, subscription, and payment information
          </CategoryDescription>
          <CategoryLink href="/docs/account">Learn More</CategoryLink>
        </CategoryCard>
      </CategoriesContainer>
      
      <FAQSection>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion onClick={() => toggleFAQ(index)}>
                {faq.question}
                {openFAQ === index ? <FiChevronUp /> : <FiChevronDown />}
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === index}>
                {faq.answer}
              </FAQAnswer>
            </FAQItem>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No results found for "{searchTerm}". Try a different search term or contact support.
          </div>
        )}
      </FAQSection>
      
      <SectionTitle>Still need help?</SectionTitle>
      
      <ContactSection>
        <ContactCard>
          <ContactIcon>
            <FiMail />
          </ContactIcon>
          <ContactTitle>Email Support</ContactTitle>
          <ContactDescription>
            Send us an email and we'll get back to you within 24 hours on weekdays.
          </ContactDescription>
          <ContactButton href="mailto:support@easyforms.com">
            Email Us
          </ContactButton>
        </ContactCard>
        
        <ContactCard>
          <ContactIcon>
            <FiMessageSquare />
          </ContactIcon>
          <ContactTitle>Live Chat</ContactTitle>
          <ContactDescription>
            Chat with our support team in real-time during business hours.
          </ContactDescription>
          <ContactButton href="#" onClick={() => alert('Live chat would open here')}>
            Start Chat
          </ContactButton>
        </ContactCard>
      </ContactSection>
    </HelpContainer>
  );
};

export default Help;
