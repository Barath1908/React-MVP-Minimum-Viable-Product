import styled from 'styled-components';
import { Card } from '@mui/material';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.name === 'light' ? '#ffffff' : (props.theme.colors?.background || "#000000")};
  color: ${(props) => props.theme.colors?.textPrimary || "#ffffff"};
  font-family: 'Inter', sans-serif;
`;

export const HeroSection = styled.div`
  padding: 80px 0 60px;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #7c5cbf, #4f8ef7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
`;

export const HeroSubtitle = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.colors?.textSecondary || "#9094a6"};
  max-width: 600px;
  margin: 0 auto 40px;
`;

export const PlanCard = styled(Card)`
  background: ${({ $featured, theme }) =>
    $featured
      ? 'linear-gradient(135deg, #7c5cbf, #4f8ef7) !important'
      : (theme.colors?.backgroundCard || '#141622') + ' !important'};
  border: 1px solid ${({ $featured, theme }) =>
    $featured ? 'transparent' : (theme.colors?.border || '#2a2d3e')} !important;
  border-radius: 16px !important;
  color: ${({ $featured, theme }) => ($featured ? '#ffffff' : (theme.colors?.textPrimary || '#ffffff'))} !important;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(124,92,191,0.2) !important;
  }
`;
