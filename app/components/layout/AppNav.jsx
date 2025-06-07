// Libraries
import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

// Tabs config
const allTabs = [
  { title: 'Dashboard', name: 'dashboard', icon: 'ion-ios-pie' },
  { title: 'Create', name: 'form', icon: 'ion-document-text' },
  { title: 'Invoices', name: 'invoices', icon: 'ion-ios-filing' },
  { title: 'Contacts', name: 'contacts', icon: 'ion-person-stalker' },
  { title: 'TVA/CSS', name: 'tvacss', icon: 'ion-calculator' },
  { title: 'Settings', name: 'settings', icon: 'ion-ios-gear' },
];

const springConfig = { stiffness: 350, damping: 18, precision: 0.01 };

const setMarginValue = activeTab => {
  const multiplier = 100 / allTabs.length;
  const activeTabIndex = findIndex(allTabs, { name: activeTab });
  return activeTabIndex * multiplier;
};

// Styled Components
const SideBar = styled.div`
  width: 72px;
  background: white;
  padding: 12px 0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
`;

const Tab = styled.a`
  width: 48px;
  height: 48px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${props => props.active ? 'rgba(72, 61, 255, 0.1)' : 'transparent'};
  color: ${props => props.active ? '#483dff' : '#666'};
  font-size: 22px;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: rgba(72, 61, 255, 0.08);
    color: #483dff;
    text-decoration: none;
  }
`;

const Icon = styled.i`
  ${props => props.id === 'dashboard' && `color: ${props.active ? '#483dff' : '#666'};`}
  ${props => props.id === 'form' && `color: ${props.active ? '#483dff' : '#666'};`}
  ${props => props.id === 'contacts' && `color: ${props.active ? '#483dff' : '#666'};`}
  ${props => props.id === 'settings' && `color: ${props.active ? '#483dff' : '#666'};`}
  ${props => props.id === 'invoices' && `color: ${props.active ? '#483dff' : '#666'};`}
`;

import AppUpdate from './AppUpdate';

function AppNav({ activeTab, changeTab }) {
  return (
    <SideBar>
      {allTabs.map(tab => (
        <Tab
          key={tab.name}
          active={activeTab === tab.name}
          onClick={() => changeTab(tab.name)}
          title={tab.title}
        >
          <Icon id={tab.name} className={tab.icon} active={activeTab === tab.name} />
        </Tab>
      ))}
      <AppUpdate />
    </SideBar>
  );
}

AppNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
};

export default AppNav;
