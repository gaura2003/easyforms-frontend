import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiChevronDown, FiBell, FiHelpCircle } from 'react-icons/fi';

const NavbarContainer = styled.nav`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: none;
  }
`;

const LogoImage = styled.img`
  height: 30px;
  margin-right: 8px;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    z-index: 100;
  }
`;

const NavLink = styled(Link)`
  margin-left: 30px;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  position: relative;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
  }
  
  ${props => props.active && `
    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${props.theme.colors.primary};
    }
  `}
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin: 10px 0;
    width: 100%;
    text-align: center;
    
    &:after {
      display: none;
    }
  }
`;

const AuthButton = styled(Link)`
  margin-left: 30px;
  padding: 8px 16px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    text-decoration: none;
    color: white;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin: 10px 0;
    width: 100%;
    text-align: center;
  }
`;

const UserMenu = styled.div`
  position: relative;
  margin-left: 30px;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  
  svg {
    margin-right: 8px;
  }
  
  .chevron {
    margin-left: 5px;
    transition: transform 0.3s;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  z-index: 100;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  overflow: hidden;
`;

const UserInfo = styled.div`
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  .name {
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .email {
    font-size: 0.85rem;
    color: ${props => props.theme.colors.textLight};
    word-break: break-all;
  }
  
  .plan {
    margin-top: 8px;
    font-size: 0.85rem;
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
    text-transform: capitalize;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: background-color 0.2s;
  
  svg {
    margin-right: 10px;
    color: ${props => props.theme.colors.textLight};
  }
  
  &:hover {
    background-color: #f5f5f5;
    text-decoration: none;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  width: 100%;
  text-align: left;
  padding: 12px 15px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.danger};
  cursor: pointer;
  font-size: 1rem;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SubscriptionBadge = styled.span`
  background-color: ${props => {
    switch(props.plan) {
      case 'pro': return props.theme.colors.primary;
      case 'enterprise': return props.theme.colors.secondary;
      default: return props.theme.colors.textLight;
    }
  }};
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  text-transform: capitalize;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: 5px 0;
`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close menus when route changes
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">
          {/* You can add a logo image here */}
          {/* <LogoImage src="/logo.svg" alt="EasyForms Logo" /> */}
          EasyForms
        </Logo>
        
        <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </MenuButton>
        
        <NavLinks isOpen={menuOpen}>
          <NavLink to="/features" active={location.pathname === '/features'}>
            Features
          </NavLink>
          <NavLink to="/pricing" active={location.pathname === '/pricing'}>
            Pricing
          </NavLink>
          <NavLink to="/templates" active={location.pathname === '/templates'}>
            Templates
          </NavLink>
          
          {isAuthenticated ? (
            <UserMenu ref={userMenuRef}>
              <UserButton 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                isOpen={userMenuOpen}
              >
                <FiUser /> 
                {user?.name || 'Account'}
                {user?.subscription_tier && user.subscription_tier !== 'free' && (
                  <SubscriptionBadge plan={user.subscription_tier}>
                    {user.subscription_tier}
                  </SubscriptionBadge>
                )}
                <FiChevronDown className="chevron" />
              </UserButton>
              
              <UserMenuDropdown isOpen={userMenuOpen}>
                <UserInfo>
                  <div className="name">{user?.name || 'User'}</div>
                  <div className="email">{user?.email || ''}</div>
                  <div className="plan">
                    {user?.subscription_tier 
                      ? `${user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1)} Plan` 
                      : 'Free Plan'}
                  </div>
                </UserInfo>
                
                <DropdownItem to="/dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Dashboard
                </DropdownItem>
                
                <DropdownItem to="/forms/create">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create Form
                </DropdownItem>
                
                <Divider />
                
                <DropdownItem to="/account">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Account Settings
                </DropdownItem>
                
                <DropdownItem to="/billing">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Billing & Plans
                </DropdownItem>
                
                <DropdownItem to="/help">
                  <FiHelpCircle />
                  Help & Support
                </DropdownItem>
                
                <Divider />
                
                <LogoutButton onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </LogoutButton>
              </UserMenuDropdown>
            </UserMenu>
          ) : (
            <>
              <NavLink to="/login" active={location.pathname === '/login'}>
                Login
              </NavLink>
              <AuthButton to="/register">Sign Up</AuthButton>
            </>
          )}
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;
