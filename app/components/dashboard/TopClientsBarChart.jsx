import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ChartContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  background: ${props => props.darkMode ? '#2d3748' : '#fff'};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(201, 201, 201, 0.1);
  transition: all 0.3s ease;
`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.darkMode ? '#f1f5f9' : '#1e293b'};
  text-align: center;
`;

const BarRow = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.div`
  margin-bottom: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.darkMode ? '#e2e8f0' : '#1e293b'};
`;

const Bar = styled.div`
  position: relative;
  height: 24px;
  background: ${props => props.darkMode ? '#4b5563' : '#e2e8f0'};
  border-radius: 8px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #3b82f6; /* Example color, can be adjusted */
  border-radius: 8px 0 0 8px;
  transition: width 0.5s ease-in-out;
`;

const BarValue = styled.div`
  position: absolute;
  right: 10px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: ${props => props.darkMode ? '#e2e8f0' : '#1e293b'};
  font-weight: 600;
`;

const TopClientsBarChart = ({ invoices, darkMode }) => {
  // Calculate client revenue
  const clientRevenue = invoices.reduce((acc, invoice) => {
    // Assuming invoice.recipient and invoice.grandTotal exist
    const clientName = invoice.recipient && invoice.recipient.fullname || 'Unknown';
    acc[clientName] = (acc[clientName] || 0) + (invoice.grandTotal || 0);
    return acc;
  }, {});

  // Get top clients
  const topClients = Object.entries(clientRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Calculate max revenue for scaling bars
  const maxRevenue = topClients.length > 0 ? Math.max(...topClients.map(([_, revenue]) => revenue)) : 0;

  return (
    <ChartContainer darkMode={darkMode}>
      <ChartTitle darkMode={darkMode}>Top Clients by Revenue</ChartTitle>
      <div>
        {topClients.map(([name, revenue]) => {
          const rawPercent = maxRevenue === 0 ? 0 : (revenue / maxRevenue) * 100;
          const widthPercent = Math.min(rawPercent, 90); // prevent reaching full width
          return (
            <BarRow key={name}>
              <Label darkMode={darkMode}>{name}</Label>
              <Bar darkMode={darkMode}>
                <BarFill width={widthPercent} />
                <BarValue darkMode={darkMode}>${revenue.toFixed(2)}</BarValue>
              </Bar>
            </BarRow>
          );
        })}
      </div>
    </ChartContainer>
  );
};

TopClientsBarChart.propTypes = {
  invoices: PropTypes.array.isRequired,
  darkMode: PropTypes.bool
};

TopClientsBarChart.defaultProps = {
  darkMode: false
};

export default TopClientsBarChart; 