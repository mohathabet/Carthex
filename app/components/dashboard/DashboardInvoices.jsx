import React from 'react';
import PropTypes from 'prop-types';
import Invoice from '../invoices/Invoice';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${props => props.darkMode ? '#f1f5f9' : '#1e293b'};
`;

const TableContainer = styled.div`
  width: 100%;
  background: ${p => p.darkMode ? '#2A2D35' : '#FFFFFF'};
  border: 1px solid ${p => p.darkMode ? '#3A3F4B' : '#E5E7EB'};
  border-radius: 8px;
  overflow: hidden;
`;

const InvoicesList = styled.div`
  display: flex;
  flex-direction: column;
`;

const DashboardInvoices = ({ invoices, darkMode }) => {
  const sliced = invoices.slice(0, 10);

  return (
    <Container>
      <SectionTitle darkMode={darkMode}>Derniers documents</SectionTitle>
      <TableContainer darkMode={darkMode}>
        <InvoicesList>
          {sliced.map(inv => (
            <Invoice
              key={inv._id}
              invoice={inv}
              darkMode={darkMode}
              deleteInvoice={() => {}}
              duplicateInvoice={() => {}}
              editInvoice={() => {}}
              setInvoiceStatus={() => {}}
              onToggleSelect={() => {}}
              isSelected={false}
              hideCheckbox
              t={v => v}
              dateFormat="DD/MM/YYYY"
            />
          ))}
        </InvoicesList>
      </TableContainer>
    </Container>
  );
};

DashboardInvoices.propTypes = {
  invoices: PropTypes.array.isRequired,
  darkMode: PropTypes.bool
};

export default DashboardInvoices; 