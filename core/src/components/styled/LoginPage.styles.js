import styled from "styled-components";
import { Typography } from "@mui/material";

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.colors?.background || "#000000"};

  @media (max-width: 860px) {
    flex-direction: column;
  }
`;

export const BrandPanel = styled.div`
  flex: 0 0 42%;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) =>
    theme.colors?.primaryGradient || "linear-gradient(135deg, #7c5cbf, #4f8ef7)"};
  color: #ffffff;
  padding: 56px 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 860px) {
    flex: none;
    padding: 40px 32px;
  }
`;

export const DecorativeCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  pointer-events: none;
`;

export const FormPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 420px;
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;

  i.icon {
    margin: 0 !important;
    font-size: 22px;
  }
`;

export const HeroText = styled.div`
  margin-top: 60px;

  @media (max-width: 860px) {
    margin-top: 32px;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  line-height: 1.25;
  margin: 0 0 16px;
`;

export const HeroSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
  max-width: 380px;
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 36px 0 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);

  i.icon {
    margin: 0 !important;
    font-size: 13px;
  }
`;

export const FooterNote = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);

  @media (max-width: 860px) {
    display: none;
  }
`;

export const FormHeader = styled.div`
  margin-bottom: 32px;
`;

export const FormTitle = styled(Typography)`
  && {
    color: ${(props) => props.theme.colors?.textPrimary || "#ffffff"};
    font-weight: 700;
    font-size: 26px;
    margin-bottom: 6px;
  }
`;

export const FormSubtitle = styled(Typography)`
  && {
    color: ${(props) => props.theme.colors?.textSecondary || "#9094a6"};
    font-size: 14px;
  }
`;

export const FormWrapper = styled.div`
  .ant-form-item {
    margin-bottom: 24px !important;
  }

  .ant-form-item-explain {
    min-height: auto !important;
  }

  .ant-form-item-explain-error {
    display: block !important;
    color: ${({ theme }) => theme.colors?.danger || "#e74c3c"} !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
    padding: 4px 0 0 !important;
    margin: 0 !important;
    position: static !important;
  }

  /* Override input highlights and legends inside the login form */
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: ${props => props.theme.colors?.border || '#2a2d3e'} !important;
    }
    &:hover fieldset {
      border-color: ${props => props.theme.colors?.border || '#2a2d3e'} !important;
    }
    &.Mui-focused fieldset {
      border-color: ${props => props.theme.colors?.border || '#2a2d3e'} !important;
    }
    & legend {
      display: none !important;
    }
  }
`;

export const BackLink = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors?.textSecondary || "#9094a6"};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 28px;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary || "#7c5cbf"};
    transform: translateX(-4px);
  }

  i.icon {
    margin: 0 !important;
    font-size: 12px;
  }
`;
