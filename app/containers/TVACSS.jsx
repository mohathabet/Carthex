import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TVACard from '../components/tva/TVACard';


const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;
const Section = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem 2rem 1.5rem 2rem;
  margin-bottom: 2rem;
  width: 100%;
`;
const PageHeader = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  text-align: center;
  color: #222;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;
const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;
const Divider = styled.hr`
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2.5rem 0 2rem 0;
`;

class TVACSS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TVA
      autoMode: true,
      tvaRate: 19,
      deductible: 0,
      dateRange: { start: '', end: '' },
      manualHT: '',
      manualTVA: '',
      trimestre: '',
      year: new Date().getFullYear().toString(),
      
    };
  }

  // TVA Handlers
  handleToggleMode = () => this.setState(state => ({ autoMode: !state.autoMode }));
  handleRateChange = e => this.setState({ tvaRate: Number(e.target.value) });
  handleDeductibleChange = e => this.setState({ deductible: e.target.value });
  handleDateRangeChange = (field, value) => this.setState(prevState => ({ dateRange: { ...prevState.dateRange, [field]: value } }));
  handleManualHTChange = e => this.setState({ manualHT: e.target.value });
  handleManualTVAChange = e => this.setState({ manualTVA: e.target.value });
  handleTrimestreChange = e => {
    const trimestre = e.target.value;
    this.setState(prev => ({
      trimestre,
      dateRange: this.getTrimestreRange(trimestre, prev.year)
    }));
  };
  handleYearChange = e => {
    const year = e.target.value;
    this.setState(prev => ({
      year,
      dateRange: this.getTrimestreRange(prev.trimestre, year)
    }));
  };
  getTrimestreRange = (trimestre, year) => {
    if (!trimestre || !year) return { start: '', end: '' };
    const y = parseInt(year, 10);
    switch (trimestre) {
      case '1': return { start: `${y}-01-01`, end: `${y}-03-31` };
      case '2': return { start: `${y}-04-01`, end: `${y}-06-30` };
      case '3': return { start: `${y}-07-01`, end: `${y}-09-30` };
      case '4': return { start: `${y}-10-01`, end: `${y}-12-31` };
      default: return { start: '', end: '' };
    }
  };
  exportTVA = () => alert('Export TVA PDF feature coming soon!');



  render() {
    const { invoices } = this.props;
    const {
      autoMode, tvaRate, deductible, dateRange, manualHT, manualTVA, trimestre, year,
      cnssSalary, cnssRate
    } = this.state;
    // TVA logic
    let baseHT = 0, tvaCollected = 0, tvaNet = 0;
    if (autoMode) {
      const filtered = invoices.filter(inv =>
        inv.tax && inv.tax.method === 'default' &&
        inv.status !== 'cancelled' &&
        (!dateRange.start || new Date(inv.created_at || inv.date) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(inv.created_at || inv.date) <= new Date(dateRange.end))
      );
      baseHT = filtered.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
      tvaCollected = filtered.reduce((sum, inv) => sum + ((inv.subtotal || 0) * (inv.tax && inv.tax.value ? inv.tax.value : tvaRate) / 100), 0);
      tvaNet = tvaCollected - Number(deductible);
    } else {
      baseHT = parseFloat(manualHT) || 0;
      tvaCollected = manualTVA ? parseFloat(manualTVA) : baseHT * (tvaRate / 100);
      tvaNet = tvaCollected - Number(deductible);
    }
    // CNSS logic
   

    return (
      
       
        <Body>
          <Section>
            
            <TVACard
              autoMode={autoMode}
              rate={tvaRate}
              deductible={deductible}
              dateRange={dateRange}
              manualHT={manualHT}
              manualTVA={manualTVA}
              trimestre={trimestre}
              year={year}
              baseHT={baseHT}
              tvaCollected={tvaCollected}
              tvaNet={tvaNet}
              onToggleMode={this.handleToggleMode}
              onRateChange={this.handleRateChange}
              onDeductibleChange={this.handleDeductibleChange}
              onDateRangeChange={this.handleDateRangeChange}
              onManualHTChange={this.handleManualHTChange}
              onManualTVAChange={this.handleManualTVAChange}
              onTrimestreChange={this.handleTrimestreChange}
              onYearChange={this.handleYearChange}
              exportTVA={this.exportTVA}
            />
          </Section>
         
        </Body>
      
    );
  }
}

TVACSS.propTypes = {
  invoices: PropTypes.array.isRequired,
};

export default TVACSS;
