// React Libraries
import React from 'react';
import PropTypes from 'prop-types';

// Helper
import { setBaseFontSize } from '../../helper';

// Styles
import styled from 'styled-components';
const Invoice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.33333em;
  width: 100%;
  font-family: 'Montserrat';
  /* flip default text-align when <Invoice dir="rtl"> */
  &[dir='rtl'] {
    text-align: right;
  }
  ${props =>
    props.baseFontSize &&
    `
    font-size: ${props.baseFontSize};
  `} .label, h4, th {
    font-weight: 500;
    font-size: 0.8em;
    text-transform: uppercase;
    text-align: left;
    letter-spacing: 1px;
    color: #2c323a;
    margin: 0;
  }
  h4 {
    margin-bottom: 0.66667em;
  }
  p {
    font-weight: 300;
    font-size: 0.8em;
    color: #2c323a;
    line-height: 1.75;
    margin: 0;
  }
  .w5 {
    width: 5%;
  }
  .w10 {
    width: 10%;
  }
  .w15 {
    width: 15%;
  }
  .w20 {
    width: 20%;
  }
`;

// Child Components
import Logo from './components/Logo';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

// Component
function Business(props) {
  const { language } = props.configs;
  return (
    <Invoice
      baseFontSize={setBaseFontSize(props.configs.fontSize)}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Logo {...props} />
      <Header {...props} />
      <Main {...props} />
      <Footer {...props} />
    </Invoice>
  );
}

Business.propTypes = {
  invoice: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  configs: PropTypes.object.isRequired,
};

export default Business;
