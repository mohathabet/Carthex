import React from "react"
import styled, { css } from "styled-components"
import { FiFileText, FiDollarSign, FiBarChart2, FiUser, FiHome, FiMoon, FiArrowUp, FiArrowDown, FiFilter } from 'react-icons/fi'
import InvoiceStatusChart from './InvoiceStatusChart'
import TopClientsBarChart from './TopClientsBarChart'
import DashboardInvoices from './DashboardInvoices'
import { connect } from 'react-redux'

// Global styles
const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
  }
`;

// Styled-components for layout and cards
const ChartContainer = styled.div`
  width: 100%;
  margin: 20px auto;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
`;

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  padding: 0px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 2;
  min-width: 300px;
  margin-right: 12px;
`;

const RightPanel = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 8px;
`;

const Container = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  padding: 32px;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  margin-right:23px;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatCardContent = styled.div`
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const StatTitle = styled.span`
  font-size: 0.98rem;
  color: #64748b;
  margin-bottom: 8px;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatValue = styled.span`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${props => props.color};
    opacity: 0.9;
  }
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  background: ${props => props.color + '10'};
  color: ${props => props.color};
  cursor: help;
  transition: all 0.3s ease;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const StatBar = styled.div`
  height: 4px;
  background: ${props => props.color};
`;

// Inline SVG icons
const IconHome = () => (
  <FiHome width="18" height="18" stroke="#64748b" strokeWidth="2" style={{marginRight: 8}} />
)

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeView: "default"
    };
    this.setActiveView = this.setActiveView.bind(this);
  }

  setActiveView(view) {
    this.setState({ activeView: view });
  }
  
  getMonthlyRevenueData() {
    // Replace this later with actual paidInvoices processing if needed
  }

  render() {
    const { invoices } = this.props;

    var paidInvoices = invoices.filter(function(inv) { return inv.status === "paid"; });
    var total = paidInvoices.length;
    var totalAmount = paidInvoices.reduce(function(sum, inv) { return sum + ((inv && inv.grandTotal) || 0); }, 0);
    var statsData = [
      {
        title: "Total Paid Invoices",
        value: total.toString(),
        icon: <FiFileText size={28} />,
        color: "#3b82f6",
      },
      {
        title: "Total Revenue",
        value: totalAmount.toFixed(0) + " DT",
        icon: <FiDollarSign size={28} />,
        color: "#22c55e",
      },
      {
        title: "Avg. Invoice",
        value: (totalAmount / total || 0).toFixed(2) + " DT",
        icon: <FiBarChart2 size={28} />,
        color: "#f59e42",
      },
      {
        title: "Clients Paid",
        value: '' + (new Set(paidInvoices.map(function(inv) { return inv.recipient && inv.recipient.fullname ? inv.recipient.fullname : ''; })).size),
        icon: <FiUser size={28} />,
        color: "#22c55e",
      },
    ];
    return (
      <Container>
        <Breadcrumb>
          <IconHome />
          <span>Dashboard</span>
        </Breadcrumb>

        <Header>
          <Title>Dashboard</Title>
          <Flex>
          </Flex>
        </Header>

        <StatsGrid>
          {statsData.map(function(stat, index) {
            return (
              <StatCard key={index}>
                <StatCardContent>
                  <StatTitle>{stat.title}</StatTitle>
                  <StatRow>
                    <StatValue color={stat.color}>
                      {stat.value}
                    </StatValue>
                    <StatTrend color={stat.color} title={stat.title}>
                      {stat.icon}
                    </StatTrend>
                  </StatRow>
                </StatCardContent>
                <StatBar color={stat.color} />
              </StatCard>
            );
          }.bind(this))}
        </StatsGrid>

        <DashboardWrapper>
          <LeftPanel>
            <ChartContainer>
              <DashboardInvoices invoices={invoices} />
            </ChartContainer>
          </LeftPanel>

          <RightPanel>
            <InvoiceStatusChart invoices={invoices} />
            <TopClientsBarChart invoices={invoices} />
          </RightPanel>
        </DashboardWrapper>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  invoices: Array.isArray(state.invoices) ? state.invoices : [],
});

export default connect(mapStateToProps)(Dashboard);
