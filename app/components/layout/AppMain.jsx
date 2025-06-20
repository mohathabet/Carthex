// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import Form from '../../containers/Form';
import Invoices from '../../containers/Invoices';
import Contacts from '../../containers/Contacts';
import Settings from '../../containers/Settings';
import Dashboard from '../../components/dashboard/Dashboard';
import TVA from '../../containers/TVA';
<<<<<<< HEAD
=======

>>>>>>> 78f7458 (TVA merge, dashboard tweaks)
// Layout
import { AppMainContent } from '../shared/Layout';

class AppMain extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.activeTab !== nextProps.activeTab;
  }

  render() {
    const { activeTab } = this.props;
    return (
      <AppMainContent>
        {activeTab === 'dashboard' && <Dashboard invoices={this.props.invoices} />}
        {activeTab === 'form' && <Form />}
        {activeTab === 'invoices' && <Invoices />}
        {activeTab === 'contacts' && <Contacts />}
        {activeTab === 'tvacss' && <TVA invoices={this.props.invoices} />}
        {activeTab === 'settings' && <Settings />}
      </AppMainContent>
    );
  }
}

AppMain.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

import { connect } from 'react-redux';

export default connect(state => ({
  activeTab: state.ui.activeTab,
  invoices: Array.isArray(state.invoices) ? state.invoices : [],
}))(AppMain);