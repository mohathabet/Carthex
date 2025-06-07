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

`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.darkMode ? '#f1f5f9' : '#1e293b'};
  text-align: center;
`;

const Chart = styled.div`
  position: relative;
  height: 300px;
`;

const CenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${props => props.darkMode ? '#f8fafc' : '#0f172a'};
  font-size: 1.25rem;
  font-weight: bold;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  gap: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px; /* <-- increased spacing */
  color: ${props => props.darkMode ? '#e2e8f0' : '#334155'};
  font-size: 0.9rem;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
  background-color: ${props => props.color};
`;

const colors = {
  paid: '#99c0ff',
  pending: '#5091fc',
  refunded: '#717785',
  cancelled: '#f4acac'
};

class InvoiceStatusChart extends React.Component {
  renderDonutChart(statusCounts) {
    const total = Object.values(statusCounts).reduce((sum, val) => sum + val, 0);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercent = 0;

    const segments = Object.entries(statusCounts).map(([status, count], index) => {
      if (count === 0) return null;
      const percent = count / total;
      const strokeDasharray = `${percent * circumference} ${circumference}`;
      const strokeDashoffset = -cumulativePercent * circumference;
      cumulativePercent += percent;

      return (
        <circle
          key={status}
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={colors[status]}
          strokeWidth="20"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
      );
    });

    return (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={this.props.darkMode ? '#1e293b' : '#e2e8f0'}
          strokeWidth="20"
        />
        {segments}
      </svg>
    );
  }

  render() {
    const { invoices, darkMode } = this.props;
    const statusCounts = {
      paid: 0,
      pending: 0,
      refunded: 0,
      cancelled: 0
    };

    invoices.forEach(invoice => {
      if (statusCounts.hasOwnProperty(invoice.status)) {
        statusCounts[invoice.status]++;
      }
    });

    const total = Object.values(statusCounts).reduce((sum, val) => sum + val, 0);

    return (
      <ChartContainer darkMode={darkMode}>
        <ChartTitle darkMode={darkMode}>Invoice Status Distribution</ChartTitle>
        <Chart>
          {this.renderDonutChart(statusCounts)}
          <CenterText darkMode={darkMode}>
            Total<br />
            {total}
          </CenterText>
        </Chart>
        <Legend>
          {Object.entries(statusCounts).map(([status, count]) => {
            if (count === 0) return null;
            const percent = Math.round((count / total) * 100);
            return (
              <LegendItem key={status} darkMode={darkMode}>
                <LegendColor color={colors[status]} />
                <span>{status.charAt(0).toUpperCase() + status.slice(1)}: {count} </span>
              </LegendItem>
            );
          })}
        </Legend>
      </ChartContainer>
    );
  }
}

InvoiceStatusChart.propTypes = {
  invoices: PropTypes.array.isRequired,
  darkMode: PropTypes.bool
};

InvoiceStatusChart.defaultProps = {
  darkMode: false
};

export default InvoiceStatusChart;
