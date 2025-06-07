import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StatCard = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem 2rem 1.5rem 2rem;
  margin-bottom: 2rem;
  width: 100%;
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
const DateGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
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
  &:hover {
    background: #2176bd;
  }
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
const TrimestreSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: #fafbfc;
  margin-left: 12px;
`;

class TVACard extends React.Component {
  render() {
    const {
      autoMode,
      rate,
      deductible,
      dateRange,
      manualHT,
      trimestre,
      year,
      baseHT,
      tvaCollected,
      tvaNet,
      onToggleMode,
      onRateChange,
      onDeductibleChange,
      onDateRangeChange,
      onManualHTChange,
      onTrimestreChange,
      onYearChange,
      exportTVA
    } = this.props;

    const calculatedManualTVA = (parseFloat(manualHT || 0) * parseFloat(rate || 0)) / 100;
    const calculatedTVANet = calculatedManualTVA - Number(deductible || 0);

    return (
      <StatCard>
        <h3 style={{fontSize: '1.3rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8}}>
          Calculateur TVA
        </h3>
        <ToggleRow>
          <input
            type="checkbox"
            id="tva-auto-toggle"
            checked={autoMode}
            onChange={onToggleMode}
          />
          <ToggleLabel htmlFor="tva-auto-toggle">
            {autoMode ? 'Automatique (depuis les factures)' : 'Manuel (saisie libre)'}
          </ToggleLabel>
        </ToggleRow>
        <DateGroup>
          <Label style={{marginBottom: 0}}>Début</Label>
          <Input
            type="date"
            value={dateRange.start}
            onChange={e => onDateRangeChange('start', e.target.value)}
            style={{maxWidth: 150}}
          />
          <Label style={{marginBottom: 0}}>Fin</Label>
          <Input
            type="date"
            value={dateRange.end}
            onChange={e => onDateRangeChange('end', e.target.value)}
            style={{maxWidth: 150}}
          />
          <TrimestreSelect value={trimestre} onChange={onTrimestreChange}>
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
            onChange={onYearChange}
            style={{maxWidth: 90}}
          />
        </DateGroup>
        <StatRow>
          <Field>
            <Label>Base HT</Label>
            {autoMode ? (
              <div style={{fontSize: '1.2rem', fontWeight: 600}}>{baseHT.toFixed(3)} DT</div>
            ) : (
              <Input
                type="number"
                value={manualHT}
                min={0}
                onChange={onManualHTChange}
              />
            )}
          </Field>
          <Field>
            <Label>Taux TVA (%)</Label>
            <Input
              type="number"
              value={rate}
              min={0}
              max={100}
              onChange={onRateChange}
            />
          </Field>
          <Field>
            <Label>TVA collectée {autoMode ? <span style={{fontSize: '0.9em', color: '#888'}}>(auto)</span> : <span style={{fontSize: '0.9em', color: '#888'}}>(manuel)</span>}</Label>
            <Input
              type="number"
              value={autoMode ? tvaCollected.toFixed(3) : calculatedManualTVA.toFixed(3)}
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
              onChange={onDeductibleChange}
            />
          </Field>
        </StatRow>
        <Highlight>
          TVA nette à payer : {(autoMode ? tvaNet : calculatedTVANet).toFixed(3)} DT
        </Highlight>
        
      </StatCard>
    );
  }
}

TVACard.propTypes = {
  autoMode: PropTypes.bool.isRequired,
  rate: PropTypes.number.isRequired,
  deductible: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  dateRange: PropTypes.shape({ start: PropTypes.string, end: PropTypes.string }).isRequired,
  manualHT: PropTypes.string.isRequired,
  trimestre: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  baseHT: PropTypes.number.isRequired,
  tvaCollected: PropTypes.number.isRequired,
  tvaNet: PropTypes.number.isRequired,
  onToggleMode: PropTypes.func.isRequired,
  onRateChange: PropTypes.func.isRequired,
  onDeductibleChange: PropTypes.func.isRequired,
  onDateRangeChange: PropTypes.func.isRequired,
  onManualHTChange: PropTypes.func.isRequired,
  onTrimestreChange: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired,
  exportTVA: PropTypes.func.isRequired
};

export default TVACard;
