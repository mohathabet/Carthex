import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  padding: 32px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 1.5rem;
`;

const ToggleLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
`;

const DateGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
`;

const TrimestreSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: #fafbfc;
  margin-left: 12px;
`;

const StatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px 24px;
  margin-bottom: 1.5rem;
`;

const Field = styled.div`
  flex: 1 1 220px;
  min-width: 180px;
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
`;

class TVA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoMode: true,
      rate: 19,
      deductible: 0,
      dateRange: { start: '', end: '' },
      manualHT: '',
      trimestre: '',
      year: new Date().getFullYear().toString(),
    };
  }

  handleToggleMode = () => {
    this.setState(state => ({ autoMode: !state.autoMode }));
  };

  handleRateChange = e => {
    this.setState({ rate: Number(e.target.value) });
  };

  handleDeductibleChange = e => {
    this.setState({ deductible: e.target.value });
  };

  handleDateRangeChange = (field, value) => {
    this.setState(prevState => ({
      dateRange: { ...prevState.dateRange, [field]: value },
    }));
  };

  handleManualHTChange = e => {
    this.setState({ manualHT: e.target.value });
  };

  handleTrimestreChange = e => {
    const trimestre = e.target.value;
    this.setState(prev => ({
      trimestre,
      dateRange: this.getTrimestreRange(trimestre, prev.year),
    }));
  };

  handleYearChange = e => {
    const year = e.target.value;
    this.setState(prev => ({
      year,
      dateRange: this.getTrimestreRange(prev.trimestre, year),
    }));
  };

  getTrimestreRange = (trimestre, year) => {
    if (!trimestre || !year) return { start: '', end: '' };
    const y = parseInt(year, 10);
    switch (trimestre) {
      case '1':
        return { start: `${y}-01-01`, end: `${y}-03-31` };
      case '2':
        return { start: `${y}-04-01`, end: `${y}-06-30` };
      case '3':
        return { start: `${y}-07-01`, end: `${y}-09-30` };
      case '4':
        return { start: `${y}-10-01`, end: `${y}-12-31` };
      default:
        return { start: '', end: '' };
    }
  };

  render() {
    const { invoices } = this.props;
    const { autoMode, rate, deductible, dateRange, manualHT, trimestre, year } = this.state;

    let baseHT = 0;
    let tvaCollected = 0;
    let tvaNet = 0;

    if (autoMode) {
      const filtered = invoices.filter(inv =>
        inv.tax &&
        inv.tax.method === 'default' &&
        inv.status !== 'cancelled' &&
        (!dateRange.start || new Date(inv.created_at || inv.date) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(inv.created_at || inv.date) <= new Date(dateRange.end))
      );
      baseHT = filtered.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
      tvaCollected = filtered.reduce(
        (sum, inv) =>
          sum + (inv.subtotal || 0) * ((inv.tax && inv.tax.value ? inv.tax.value : rate) / 100),
        0
      );
      tvaNet = tvaCollected - Number(deductible);
    } else {
      baseHT = parseFloat(manualHT) || 0;
      tvaCollected = baseHT * (rate / 100);
      tvaNet = tvaCollected - Number(deductible);
    }

    const calculatedManualTVA = (parseFloat(manualHT || 0) * parseFloat(rate || 0)) / 100;
    const calculatedTVANet = calculatedManualTVA - Number(deductible || 0);

    return (
      <Container>
        <Card>
          <Title>
            <span role="img" aria-label="calculator">🧮</span>
            Calculateur TVA
          </Title>
          <ToggleRow>
            <input
              type="checkbox"
              id="tva-auto-toggle"
              checked={autoMode}
              onChange={this.handleToggleMode}
            />
            <ToggleLabel htmlFor="tva-auto-toggle">
              {autoMode ? 'Automatique (depuis les factures)' : 'Manuel (saisie libre)'}
            </ToggleLabel>
          </ToggleRow>
          <DateGroup>
            <Label style={{ marginBottom: 0 }}>Début</Label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={e => this.handleDateRangeChange('start', e.target.value)}
              style={{ maxWidth: 150 }}
            />
            <Label style={{ marginBottom: 0 }}>Fin</Label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={e => this.handleDateRangeChange('end', e.target.value)}
              style={{ maxWidth: 150 }}
            />
            <TrimestreSelect value={trimestre} onChange={this.handleTrimestreChange}>
              <option value="">Trimestre</option>
              <option value="1">T1</option>
              <option value="2">T2</option>
              <option value="3">T3</option>
              <option value="4">T4</option>
            </TrimestreSelect>
            <Input
              type="number"
              value={year}
              min={2000}
              max={2100}
              onChange={this.handleYearChange}
              style={{ maxWidth: 90 }}
            />
          </DateGroup>
          <StatRow>
            <Field>
              <Label>Base HT</Label>
              {autoMode ? (
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{baseHT.toFixed(3)} DT</div>
              ) : (
                <Input type="number" value={manualHT} min={0} onChange={this.handleManualHTChange} />
              )}
            </Field>
            <Field>
              <Label>Taux TVA (%)</Label>
              <Input type="number" value={rate} min={0} max={100} onChange={this.handleRateChange} />
            </Field>
            <Field>
              <Label>
                TVA collectée{' '}
                {autoMode ? (
                  <span style={{ fontSize: '0.9em', color: '#888' }}>(auto)</span>
                ) : (
                  <span style={{ fontSize: '0.9em', color: '#888' }}>(manuel)</span>
                )}
              </Label>
              <Input
                type="number"
                value={autoMode ? tvaCollected.toFixed(3) : calculatedManualTVA.toFixed(3)}
                readOnly
                style={{ background: '#f3f4f6', color: '#555' }}
              />
            </Field>
            <Field>
              <Label>TVA déductible</Label>
              <Input type="number" value={deductible} min={0} onChange={this.handleDeductibleChange} />
            </Field>
          </StatRow>
          <Highlight>
            TVA nette à payer : {(autoMode ? tvaNet : calculatedTVANet).toFixed(3)} DT
          </Highlight>
        </Card>
      </Container>
    );
  }
}

TVA.propTypes = {
  invoices: PropTypes.array.isRequired,
};

export default TVA;
