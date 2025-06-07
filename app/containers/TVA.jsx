import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  padding: 32px;
  position: relative;
  z-index: 1;
  overflow: visible;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  margin: 0 auto;
  padding: 32px;
  position: relative;
  z-index: 1;
  overflow: visible;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px 24px;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
  overflow: visible;
`;

const Field = styled.div`
  flex: 1 1 220px;
  min-width: 180px;
  position: relative;
  z-index: 1;
  overflow: visible;
`;

const Label = styled.label`
  display: block;
  color: #4f555c;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 0;
  background: #fafbfc;
  position: relative;
  z-index: 1;
  &:focus {
    outline: none;
    border-color: #469fe5;
    background: #fff;
  }
`;

const Highlight = styled.div`
  background: #e6ffed;
  color: #15803d;
  font-weight: bold;
  border-radius: 0.5rem;
  padding: 1.2rem 1rem;
  font-size: 1.3rem;
  text-align: center;
  margin: 2rem 0 0.5rem 0;
  position: relative;
  z-index: 1;
`;

const DateGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const ExportButton = styled.button`
  background: #469fe5;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  padding: 10px 28px;
  font-size: 1rem;
  margin-top: 1.5rem;
  box-shadow: 0 1px 4px rgba(70,159,229,0.08);
  cursor: pointer;
  transition: background 0.18s;
  position: relative;
  z-index: 1;
  &:hover {
    background: #2176bd;
  }
`;

// Dropdown Menu Styles
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 180px;
  z-index: 9999;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f1f5f9;
  }
`;

class TVA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 19,
      deductible: 0,
      dateRange: { start: '', end: '' },
      showDropdown: false,
    };
  }

  handleRateChange = e => {
    this.setState({ rate: Number(e.target.value) });
  };

  handleDeductibleChange = e => {
    this.setState({ deductible: e.target.value });
  };

  handleDateChange = (field, value) => {
    this.setState(prevState => ({
      dateRange: { ...prevState.dateRange, [field]: value },
    }));
  };

  handleExport = () => {
    alert('Export PDF feature coming soon!');
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      showDropdown: !prevState.showDropdown
    }));
  };

  render() {
    const { invoices } = this.props;
    const { rate, deductible, dateRange, showDropdown } = this.state;
    
    // Filter invoices with default tax method and by date
    const filtered = invoices.filter(inv =>
      inv.tax && inv.tax.method === 'default' &&
      (!dateRange.start || new Date(inv.created_at || inv.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(inv.created_at || inv.date) <= new Date(dateRange.end))
    );
    
    const baseHT = filtered.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
    const tvaCollected = baseHT * (rate / 100);
    const tvaNet = tvaCollected - Number(deductible);

    return (
      <Container>
        <Card>
          <Title>
            <span role="img" aria-label="calculator">🧮</span>
            Générateur TVA
          </Title>
          
          <DateGroup>
            <Label style={{marginBottom: 0}}>Début</Label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={e => this.handleDateChange('start', e.target.value)}
              style={{maxWidth: 150}}
            />
            <Label style={{marginBottom: 0}}>Fin</Label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={e => this.handleDateChange('end', e.target.value)}
              style={{maxWidth: 150}}
            />
          </DateGroup>

          <StatRow>
            <Field>
              <Label>Base HT</Label>
              <div style={{fontSize: '1.2rem', fontWeight: 600}}>
                {baseHT.toFixed(3)} DT
              </div>
            </Field>
            <Field>
              <Label>Taux TVA (%)</Label>
              <Input
                type="number"
                value={rate}
                min={0}
                max={100}
                onChange={this.handleRateChange}
              />
            </Field>
            <Field>
              <Label>TVA collectée</Label>
              <Input
                type="number"
                value={tvaCollected.toFixed(3)}
                readOnly
                style={{ background: '#f3f4f6', color: '#555' }}
              />
            </Field>
            <Field>
              <Label>TVA déductible</Label>
              <Input
                type="number"
                value={deductible}
                min={0}
                onChange={this.handleDeductibleChange}
              />
            </Field>
          </StatRow>

          <Highlight>
            TVA nette à payer : {tvaNet.toFixed(3)} DT
          </Highlight>

          <ExportButton onClick={this.handleExport}>
            Exporter en PDF
          </ExportButton>
        </Card>
      </Container>
    );
  }
}

TVA.propTypes = {
  invoices: PropTypes.array.isRequired,
};

export default TVA;
