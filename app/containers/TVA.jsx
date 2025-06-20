import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';
import { connect } from 'react-redux';
import { getEntrepriseInfo } from '../reducers/SettingsReducer';

/**
 * --------------------------------------------------
 *  Styled Components
 * --------------------------------------------------
 */
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
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
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

const ExportButton = styled.button`
  display: block;
  margin-left: auto;
  padding: 10px 24px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #1e4ed8;
  }
`;

/**
 * --------------------------------------------------
 *  TVA Component
 * --------------------------------------------------
 */
class TVA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 19,
      deductible: 0,
      dateRange: { start: '', end: '' },
    };
  }

  /**
   * Update the date range (start / end)
   */
  handleDateRangeChange = (field, value) => {
    this.setState(prevState => ({
      dateRange: { ...prevState.dateRange, [field]: value },
    }));
  };

  handleRateChange = e => {
    this.setState({ rate: Number(e.target.value) });
  };

  handleDeductibleChange = e => {
    this.setState({ deductible: Number(e.target.value) });
  };

  /**
   * Export the displayed card as PDF using html2pdf.js
   */
  handleExport = () => {
    const element = document.getElementById('tva-card');
    if (!element) return;
    const opt = {
      margin:       0.5,
      filename:     `TVA_${new Date().toISOString().slice(0,10)}.pdf`,
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  render() {
    const { invoices } = this.props;
    const { rate, deductible, dateRange } = this.state;

    /* Filter invoices that use the default tax method and fall within the selected dates */
    const filtered = invoices.filter(inv =>
      inv.tax && inv.tax.method === 'default' &&
      (!dateRange.start || new Date(inv.created_at || inv.date) >= new Date(dateRange.start)) &&
      (!dateRange.end   || new Date(inv.created_at || inv.date) <= new Date(dateRange.end))
    );

    const baseHT = filtered.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
    const tvaCollected = baseHT * (rate / 100);
    const tvaNet = tvaCollected - deductible;

    return (
      <Container>
        <Card id="tva-card">
          <Title>
            <span role="img" aria-label="calculator">🧮</span>
            Générateur TVA
          </Title>

          <DateGroup>
            <Label htmlFor="start-date">Début</Label>
            <Input
              id="start-date"
              type="date"
              value={dateRange.start}
              onChange={e => this.handleDateRangeChange('start', e.target.value)}
              style={{ maxWidth: 150 }}
            />
            <Label htmlFor="end-date">Fin</Label>
            <Input
              id="end-date"
              type="date"
              value={dateRange.end}
              onChange={e => this.handleDateRangeChange('end', e.target.value)}
              style={{ maxWidth: 150 }}
            />
          </DateGroup>

          <StatRow>
            <Field>
              <Label>Base HT</Label>
              <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
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

const mapStateToProps = state => ({
  company: getEntrepriseInfo(state),
});

export default connect(mapStateToProps)(TVA);