import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: white;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 40px 0;
  margin-top: 60px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
`;

const FooterColumn = styled.div``;

const FooterTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const FooterLink = styled(Link)`
  display: block;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.textLight};
  text-decoration: none;
  
   &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
  }
`;

const ExternalLink = styled.a`
  display: block;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.textLight};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
  }
`;

const Copyright = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textLight};
  font-size: 0.875rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: 40px;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <FooterTitle>EasyForms</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/pricing">Pricing</FooterLink>
          <FooterLink to="/login">Login</FooterLink>
          <FooterLink to="/register">Sign Up</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Resources</FooterTitle>
          <ExternalLink href="#" target="_blank">Documentation</ExternalLink>
          <ExternalLink href="#" target="_blank">API Reference</ExternalLink>
          <ExternalLink href="#" target="_blank">Examples</ExternalLink>
          <ExternalLink href="#" target="_blank">Blog</ExternalLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Legal</FooterTitle>
          <ExternalLink href="#" target="_blank">Privacy Policy</ExternalLink>
          <ExternalLink href="#" target="_blank">Terms of Service</ExternalLink>
          <ExternalLink href="#" target="_blank">Cookie Policy</ExternalLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Contact</FooterTitle>
          <ExternalLink href="mailto:support@easyforms.example.com">support@easyforms.example.com</ExternalLink>
          <ExternalLink href="#" target="_blank">Twitter</ExternalLink>
          <ExternalLink href="#" target="_blank">GitHub</ExternalLink>
        </FooterColumn>
      </FooterContent>
      
      <Copyright>
        © {currentYear} EasyForms. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
