// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
const openDialog = require('../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;
import { translate } from 'react-i18next';

// Actions
import * as Actions from '../actions/invoices';

// Selectors
import { getInvoices } from '../reducers/InvoicesReducer';
import { getDateFormat } from '../reducers/SettingsReducer';

// Components
import Invoice from '../components/invoices/Invoice';
import Message from '../components/shared/Message';
import Button from '../components/shared/Button';
import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';

// Styled Components
const Container = styled.div`
  padding: 24px;
  background: ${props => props.darkMode ? '#1A1D24' : '#F9FAFB'};
  min-height: 100vh;
  position: relative;
  overflow: visible;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.darkMode ? '#F3F4F6' : '#111827'};
  margin: 0;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const FilterButton = styled(Button)`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background: ${props => props.$active 
    ? (props.darkMode ? '#3A3F4B' : '#E5E7EB')
    : (props.darkMode ? '#2A2D35' : '#FFFFFF')};
  color: ${props => props.$active
    ? (props.darkMode ? '#F3F4F6' : '#111827')
    : (props.darkMode ? '#9CA3AF' : '#6B7280')};
  border: 1px solid ${props => props.darkMode ? '#3A3F4B' : '#E5E7EB'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.darkMode ? '#3A3F4B' : '#E5E7EB'};
    color: ${props => props.darkMode ? '#F3F4F6' : '#111827'};
  }
`;

const ScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
  z-index: 0;
`;

const TableContainer = styled.div`
  width: 100%;
  background: ${p => p.darkMode ? '#2A2D35' : '#FFFFFF'};
  border: 1px solid ${p => p.darkMode ? '#3A3F4B' : '#E5E7EB'};
  border-radius: 8px;
  overflow: visible;
  position: relative;
  z-index: 0;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  column-gap: 24px;
  background: ${p => p.darkMode ? '#2A2D35' : '#FFFFFF'};
  border-bottom: 1px solid ${p => p.darkMode ? '#3A3F4B' : '#E5E7EB'};
  font-weight: 600;
  color: ${p => p.darkMode ? '#9CA3AF' : '#6B7280'};
  font-size: 13px;
  text-transform: uppercase;
`;

const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InvoicesList = styled.div`
  display: flex;
  flex-direction: column;
  overflow: visible;
  position: relative;
  z-index: 0;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 36px;
  background: ${props => props.darkMode ? '#1F2937' : '#FFFFFF'};
  border: 1px solid ${props => props.darkMode ? '#374151' : '#E5E7EB'};
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 9999;
  min-width: 160px;
`;

const ScrollContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

export class Invoices extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filter: null,
      selectedInvoices: [],
      sortField: null,
      sortOrder: 'asc',
    };
    this.menuRef = null;
    this.triggerRef = null;
  }

  componentDidMount() {
    ipc.on('confirmed-delete-invoice', (event, index, invoiceId) => {
      if (index === 0) this.confirmedDeleteInvoice(invoiceId);
    });
    document.addEventListener('mousedown', this.handleOutsideClick, true);
  }

  componentWillUnmount() {
    ipc.removeAllListeners('confirmed-delete-invoice');
    document.removeEventListener('mousedown', this.handleOutsideClick, true);
  }

  deleteInvoice = (invoiceId) => {
    const { t } = this.props;
    openDialog({
      type: 'warning',
      title: t('dialog:deleteInvoice:title'),
      message: t('dialog:deleteInvoice:message'),
      buttons: [t('common:yes'), t('common:noThanks')],
    }, 'confirmed-delete-invoice', invoiceId);
  };

  confirmedDeleteInvoice = (invoiceId) => {
    this.props.dispatch(Actions.deleteInvoice(invoiceId));
  };

  setInvoiceStatus = (invoiceId, status) => {
    this.props.dispatch(Actions.setInvoiceStatus(invoiceId, status));
  };

  editInvoice = (invoice) => {
    this.props.dispatch(Actions.editInvoice(invoice));
  };

  duplicateInvoice = (invoice) => {
    if (invoice) {
      this.props.dispatch(Actions.duplicateInvoice(invoice));
    }
  };

  setFilter = (event) => {
    const newFilter = event.target.dataset.filter;
    this.setState(prev => ({
      filter: prev.filter === newFilter ? null : newFilter
    }));
  };

  toggleSelect = (invoiceId) => {
    this.setState(prevState => {
      const selected = new Set(prevState.selectedInvoices);
      selected.has(invoiceId) ? selected.delete(invoiceId) : selected.add(invoiceId);
      return { selectedInvoices: Array.from(selected) };
    });
  };

  toggleSelectAll = () => {
    const { invoices } = this.props;
    this.setState(prev => ({
      selectedInvoices: prev.selectedInvoices.length === invoices.length
        ? []
        : invoices.map(i => i._id)
    }));
  };

  handleOutsideClick(e) {
    if (
      this.menuRef &&
      !this.menuRef.contains(e.target) &&
      this.triggerRef &&
      !this.triggerRef.contains(e.target)
    ) {
      this.setState({ menuOpen: false });
    }
  }

  handleSort = (field) => {
    this.setState(prev => ({
      sortField: prev.sortField === field ? field : field,
      sortOrder: prev.sortField === field
        ? (prev.sortOrder === 'asc' ? 'desc' : 'asc')
        : 'asc'
    }));
  }

  render() {
    const { dateFormat, invoices, t, darkMode } = this.props;
    const { filter, selectedInvoices, sortField, sortOrder } = this.state;

    // 1) apply filter
    let display = filter
      ? invoices.filter(inv => inv.status === filter)
      : [...invoices];

    // 2) then sort
    if (sortField) {
      const fn = {
        invoiceID: inv => inv.invoiceID || inv._id,
        client:    inv => inv.recipient.fullname.toLowerCase(),
        createdOn: inv => new Date(inv.created_at),
        status:    inv => inv.status,
        total:     inv => inv.grandTotal
      }[sortField];

      display.sort((a,b) => {
        const A = fn(a), B = fn(b);
        if (A < B) return sortOrder === 'asc' ? -1 : 1;
        if (A > B) return sortOrder === 'asc' ?  1 : -1;
        return 0;
      });
    }

    const statuses = ['paid', 'pending', 'refunded', 'cancelled'];
    const filterButtons = statuses.map(status => (
      <FilterButton
        key={status}
        data-filter={status}
        onClick={this.setFilter}
        $active={filter === status}
        darkMode={darkMode}
      >
        {t(`invoices:status:${status}`)}
      </FilterButton>
    ));

    return (
      <Container darkMode={darkMode}>
        <Header>
          <Title darkMode={darkMode}>{t('invoices:header:name')}</Title>
        </Header>

        <FilterBar>{filterButtons}</FilterBar>

        {selectedInvoices.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
            <Button onClick={() => selectedInvoices.forEach(id => this.setInvoiceStatus(id, 'paid'))}>
              {t('invoices:btns:markAsPaid')}
            </Button>
            <Button onClick={() => selectedInvoices.forEach(id => {
              const invoice = invoices.find(inv => inv._id === id);
              this.duplicateInvoice(invoice);
            })}>
              {t('invoices:btns:duplicate')}
            </Button>
            <Button onClick={() => selectedInvoices.forEach(id => this.deleteInvoice(id))}>
              {t('invoices:btns:delete')}
            </Button>
          </div>
        )}

        {invoices.length === 0 ? (
          <Message info text={t('messages:noInvoice')} />
        ) : (
          <ScrollWrapper>
          <TableContainer darkMode={darkMode}>
            <TableHeader darkMode={darkMode}>
                {[
                  { key: 'checkbox', label: '', width: 56, align: 'flex-start' },
                  { key: 'invoiceID', label: 'INVOICE ID', width: 120, align: 'flex-start' },
                  { key: 'client', label: 'CLIENT', flex: 1, align: 'flex-start' },
                  { key: 'createdOn', label: 'CREATED ON', width: 140, align: 'flex-start' },
                  { key: 'status', label: 'STATUS', width: 120, align: 'flex-start' },
                  { key: 'total', label: 'TOTAL VALUE', width: 140, align: 'flex-end' },
                  { key: 'actions', label: 'ACTIONS', width: 60, align: 'flex-end' },
                ].map(col => (
                  <HeaderCell
                    key={col.key}
                    style={{
                      width: col.width,
                      flex: col.flex || 'none',
                      cursor: col.key === 'actions' || col.key === 'checkbox' ? 'default' : 'pointer',
                      justifyContent: col.align,
                    }}
                    onClick={col.key !== 'actions' && col.key !== 'checkbox'
                      ? () => this.handleSort(col.key)
                      : undefined}
                  >
                    {col.label}
                    {this.state.sortField === col.key && (
                      this.state.sortOrder === 'asc'
                        ? <FiChevronUp size={12} style={{marginLeft:4}}/>
                        : <FiChevronDown size={12} style={{marginLeft:4}}/>
                    )}
                  </HeaderCell>
                ))}
            </TableHeader>
            <InvoicesList>
                {display.map(invoice => (
                <Invoice
                  key={invoice._id}
                    invoice={invoice}
                  dateFormat={dateFormat}
                    darkMode={darkMode}
                    isSelected={selectedInvoices.includes(invoice._id)}
                  deleteInvoice={() => this.deleteInvoice(invoice._id)}
                  duplicateInvoice={() => this.duplicateInvoice(invoice)}
                  editInvoice={() => this.editInvoice(invoice)}
                  setInvoiceStatus={this.setInvoiceStatus}
                  onToggleSelect={() => this.toggleSelect(invoice._id)}
                />
              ))}
            </InvoicesList>
          </TableContainer>
          </ScrollWrapper>
        )}
      </Container>
    );
  }
}

Invoices.propTypes = {
  dispatch: PropTypes.func.isRequired,
  invoices: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

Invoices.defaultProps = {
  darkMode: false,
};

const mapStateToProps = state => ({
  invoices: getInvoices(state),
  dateFormat: getDateFormat(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Invoices);
