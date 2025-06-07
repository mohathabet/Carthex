import React from 'react';
import { connect } from 'react-redux';
import Dashboard from '../components/dashboard/Dashboard';
import PropTypes from 'prop-types';

function DashboardContainer(props) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <Dashboard invoices={props.invoices} />
      </div>
    </div>
  );
}

DashboardContainer.propTypes = {
  invoices: PropTypes.array,
};

const mapStateToProps = state => ({
  invoices: Array.isArray(state.invoices) ? state.invoices : [],
});

export default connect(mapStateToProps)(DashboardContainer);
