import styled from 'styled-components';
import { StyledTextField } from '../common';

export const DashboardLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors?.background || "#000000"};
  color: ${(props) => props.theme.colors?.textPrimary || "#ffffff"};
`;

export const Sidebar = styled.div`
  width: 260px;
  background-color: ${(props) => props.theme.colors?.sidebar || "#09090b"};
  border-right: 1px solid ${(props) => props.theme.colors?.border || "#1e2130"};
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors?.textPrimary || "#ffffff"};
`;

export const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
`;

export const SidebarMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  font-weight: 500;
  color: ${props => props.$active 
    ? (props.theme.colors?.primary || '#7c5cbf') 
    : (props.theme.colors?.textSecondary || '#9094a6')};
  background-color: ${props => props.$active 
    ? 'rgba(124, 92, 191, 0.08)' 
    : 'transparent'};
  border-left: ${props => props.$active 
    ? `3px solid ${props.theme.colors?.primary || '#7c5cbf'}` 
    : '3px solid transparent'};

  &:hover {
    color: ${(props) => props.theme.colors?.primary || "#7c5cbf"};
    background-color: rgba(124, 92, 191, 0.04);
  }
`;

export const SidebarFooter = styled.div`
  margin-top: auto;
  border-top: 1px solid ${(props) => props.theme.colors?.border || "#1e2130"};
  padding-top: 20px;
`;

export const LogoutLink = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #e53e3e;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(229, 62, 62, 0.08);
  }
`;

export const MainWorkspace = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  overflow-y: auto;
  height: 100vh;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${(props) => props.theme.colors?.border || "#1e2130"};
`;

export const Title = styled.h2`
  margin: 0;
  font-weight: 700;
  color: ${(props) => props.theme.colors?.textPrimary || "#ffffff"};
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${(props) => props.theme.colors?.textPrimary || "#ffffff"};
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid ${(props) => props.theme.colors?.border || "#1e2130"};
`;

export const ContentArea = styled.div`
  flex-grow: 1;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

export const CardTitle = styled.h3`
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.colors?.textSecondary || "#9094a6"};
`;

export const Count = styled.p`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: ${(props) => props.theme.colors?.textPrimary || "#ffffff"};
`;

export const ThemeSelectField = styled(StyledTextField)`
  & .MuiOutlinedInput-root {
    background-color: transparent !important;
    height: 40px !important;
    border-radius: 8px !important;
    
    & fieldset {
      border-color: ${props => props.theme.colors?.border || '#2a2d3e'} !important;
      border-width: 1px !important;
    }
    
    &:hover fieldset {
      border-color: ${props => props.theme.colors?.primary || '#7c5cbf'} !important;
    }

    &.Mui-focused fieldset {
      border-color: ${props => props.theme.colors?.primary || '#7c5cbf'} !important;
      border-width: 1px !important;
    }
  }

  & .MuiOutlinedInput-input {
    color: ${props => props.theme.colors?.textPrimary || '#ffffff'} !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    padding: 0 14px !important;
    display: flex !important;
    align-items: center !important;
  }

  & .MuiSvgIcon-root {
    color: ${props => props.theme.colors?.textSecondary || '#9094a6'} !important;
  }
`;
