import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

const NavbarContainer = styled.nav`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  
  &:hover {
    text-decoration: none;
  }
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
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin: 10px 0;
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
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    text-decoration: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin: 10px 0;
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
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 100;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px 15px;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  
  &:hover {
    background-color: #f5f5f5;
    text-decoration: none;
  }
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 15px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.danger};
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">EasyForms</Logo>
        
        <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </MenuButton>
        
        <NavLinks isOpen={menuOpen}>
          <NavLink to="/pricing">Pricing</NavLink>
          
          {isAuthenticated ? (
            <UserMenu>
              <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <FiUser /> {user?.name}
              </UserButton>
              
              <UserMenuDropdown isOpen={userMenuOpen}>
                <DropdownItem to="/dashboard">Dashboard</DropdownItem>
                <DropdownItem to="/account">Account</DropdownItem>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
              </UserMenuDropdown>
            </UserMenu>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <AuthButton to="/register">Sign Up</AuthButton>
            </>
          )}
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;