import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiCopy, FiClock, FiXCircle, FiDollarSign, FiCheck, FiChevronRight, FiChevronLeft, FiChevronUp, FiChevronDown, FiRotateCcw, FiX } from 'react-icons/fi';
const moment = require('moment');
const ipc = require('electron').ipcRenderer;

import { formatNumber } from '../../../helpers/formatNumber';
import { calTermDate } from '../../../helpers/date';
import Button from '../shared/Button';

// Styled components
const InvoiceRowCell = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
`;

const InvoiceRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  column-gap: 24px;
  background: ${p => p.darkMode ? '#2A2D35' : '#FFFFFF'};
  border-bottom: 1px solid ${p => p.darkMode ? '#3A3F4B' : '#E5E7EB'};
  position: relative;
  cursor: default;
  &:hover { background: ${p => p.darkMode ? '#3A3F4B' : '#F9FAFB'}; }
`;

const CustomCheckbox = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid ${props => props.darkMode ? '#4B5563' : '#D1D5DB'};
  background-color: ${props => props.checked ? (props.darkMode ? '#4ADE80' : '#16A34A') : 'transparent'};
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;

  &:after {
    content: '';
    position: absolute;
    display: ${props => props.checked ? 'block' : 'none'};
    left: 4px;
    top: 0px;
    width: 5px;
    height: 10px;
    border: solid ${props => props.darkMode ? '#1E293B' : '#FFFFFF'};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  &:hover {
    border-color: ${props => props.darkMode ? '#9CA3AF' : '#9CA3AF'};
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ClientSection = styled.div`
  display: flex;
  align-items: center;
`;

const ClientAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.darkMode ? '#3A3F4B' : '#F3F4F6'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${props => props.darkMode ? '#E5E7EB' : '#4B5563'};
  margin-right: 16px;
`;

const ClientInfo = styled.div`
  overflow: hidden;
`;

const ClientName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.darkMode ? '#F3F4F6' : '#111827'};
  margin-bottom: 4px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const InvoiceId = styled.div`
  font-size: 13px;
  color: ${props => props.darkMode ? '#9CA3AF' : '#6B7280'};
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  text-transform: none;
  svg {
   margin-right: 5px;      /* adjust to taste */
 }

  background: ${({ status }) => {
    switch (status) {
      case 'paid':      return '#D1FAE5';
      case 'pending':   return '#DBEAFE';
      case 'refunded':  return '#F3F4F6';
      case 'cancelled': return '#FEE2E2';
      default:          return '#F3F4F6';
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case 'paid':      return '#059669';
      case 'pending':   return '#2563EB';
      case 'refunded':  return '#6B7280';
      case 'cancelled': return '#DC2626';
      default:          return '#111827';
    }
  }};
`;

const InvoiceTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: 600;
  color: ${props => props.darkMode ? '#F3F4F6' : '#111827'};
`;

const DateColumn = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: ${props => props.darkMode ? '#9CA3AF' : '#6B7280'};
`;

const ActionWrapper = styled.div`
  position: relative;
`;

const MenuTrigger = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${props => props.darkMode ? '#D1D5DB' : '#4B5563'};
`;

const DropdownMenu = styled.div`
  position: fixed;
  right: 16px;
  top: ${({ triggerTop }) => triggerTop}px;
  background: ${props => props.darkMode ? '#1F2937' : '#FFFFFF'};
  border: 1px solid ${props => props.darkMode ? '#374151' : '#E5E7EB'};
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 9999;
  min-width: 160px;
  white-space: nowrap;
`;

const MenuItem = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  color: ${props => props.darkMode ? '#F3F4F6' : '#111827'};
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: ${props => props.darkMode ? '#374151' : '#F9FAFB'};
  }
`;

const SubMenuContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row-reverse;
`;

const SubMenu = styled.div`
  position: absolute;
  top: 0;
  right: 100%;
  margin-right: 4px;
  background: ${props => props.darkMode ? '#1F2937' : '#FFFFFF'};
  border: 1px solid ${props => props.darkMode ? '#374151' : '#E5E7EB'};
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  min-width: 160px;
  white-space: nowrap;
`;

const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

class Invoice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      showStatusSubMenu: false,
      menuTop: 0
    };
    this.menuRef = null;
    this.triggerRef = null;
    this.wrapperRef = null;
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.toggleSubMenu = this.toggleSubMenu.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  handleOutsideClick(e) {
    // If click is outside of this row's entire component (incl. menu + trigger)
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(e.target)
    ) {
      this.setState({ menuOpen: false });
    }
  }

  toggleMenu(e) {
    e.stopPropagation();
    const triggerTop = this.triggerRef.getBoundingClientRect().top + window.scrollY + 36;
    this.setState(prev => ({ 
      menuOpen: !prev.menuOpen,
      menuTop: triggerTop
    }));
  }

  handleRowClick(e, invoice) {
    console.log("Row clicked!"); // Debug log

    // Skip if clicking on action buttons or menu
    if (
      (this.menuRef && typeof this.menuRef.contains === 'function' && this.menuRef.contains(e.target)) ||
      (this.triggerRef && typeof this.triggerRef.contains === 'function' && this.triggerRef.contains(e.target)) ||
      e.target.tagName === 'BUTTON' ||
      e.target.tagName === 'INPUT' ||
      (e.target.closest && e.target.closest('button')) ||
      (e.target.closest && e.target.closest('input'))
    ) {
      return;
    }

    ipc.send('preview-invoice', invoice);
  }

  toggleSubMenu = () => {
    this.setState(prev => ({
      showStatusSubMenu: !prev.showStatusSubMenu,
    }));
  };

  renderDueDate() {
    const { invoice } = this.props;
    try {
      const dueDate = invoice.dueDate || {};
      const useCustom = dueDate.useCustom;
      const selectedDate = dueDate.selectedDate;
      const paymentTerm = dueDate.paymentTerm;
      const dateFormat = (invoice.configs && invoice.configs.dateFormat) || 'MM/DD/YYYY';

      if (useCustom && selectedDate) {
        return moment(selectedDate).format(dateFormat);
      }

      const termDate = calTermDate(invoice.created_at, paymentTerm);
      return moment(termDate).format(dateFormat);
    } catch (e) {
      console.warn('Due date error:', e);
      return '--';
    }
  }

  render() {
    const {
      invoice,
      setInvoiceStatus,
      deleteInvoice,
      duplicateInvoice,
      editInvoice,
      t,
      darkMode,
      isSelected,
      onToggleSelect,
      hideCheckbox,
      hideMenu
    } = this.props;

    const { menuOpen } = this.state;
    if (!invoice || !invoice.recipient || !invoice.currency) {
      return <div style={{ color: 'red' }}>⚠️ Invoice data missing</div>;
    }

    const fullname = invoice.recipient.fullname || '';
    const clientInitials = fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const currencyBefore = invoice.currency.placement === 'before';
    const currencyCode = invoice.currency.code || '';
    const dateFormat = (invoice.configs && invoice.configs.dateFormat) || 'MM/DD/YYYY';

    return (
      <div ref={(ref) => (this.wrapperRef = ref)}>
        <InvoiceRow darkMode={darkMode} onClick={e => this.handleRowClick(e, invoice)}>
          {!hideCheckbox && (
            <InvoiceRowCell style={{ width: 56 }}>
              <CustomCheckbox
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                darkMode={darkMode}
              />
            </InvoiceRowCell>
          )}

          <InvoiceRowCell style={{ width: 120 }}>
            <InvoiceId darkMode={darkMode}>
              {invoice.invoiceID || truncate(invoice._id || '', { length: 8 })}
            </InvoiceId>
          </InvoiceRowCell>

          <InvoiceRowCell style={{ flex: 1 }}>
            <ClientSection>
              <ClientAvatar darkMode={darkMode}>{clientInitials}</ClientAvatar>
              <ClientInfo>
                <ClientName darkMode={darkMode}>{fullname}</ClientName>
              </ClientInfo>
            </ClientSection>
          </InvoiceRowCell>

          <InvoiceRowCell style={{ width: 140 }}>
            <DateColumn darkMode={darkMode}>
              {moment(invoice.created_at || new Date()).format(dateFormat)}
            </DateColumn>
          </InvoiceRowCell>

          <InvoiceRowCell style={{ width: 120 }}>
            <StatusBadge status={invoice.status}>
              {invoice.status === 'paid'      && <FiCheck size={14} />}
              {invoice.status === 'pending'   && <FiClock size={14} />}
              {invoice.status === 'refunded'  && <FiRotateCcw size={14} />}
              {invoice.status === 'cancelled' && <FiX size={14} />}
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </StatusBadge>
          </InvoiceRowCell>

          <InvoiceRowCell style={{ width: 140, justifyContent: 'flex-end' }}>
            <InvoiceTotal darkMode={darkMode}>
              {currencyBefore && currencyCode}{' '}
              {formatNumber(invoice.grandTotal || 0, invoice.currency.fraction || 2, invoice.currency.separator || ',')}{' '}
              {!currencyBefore && currencyCode}
            </InvoiceTotal>
          </InvoiceRowCell>

          {/* Action column: three-dot menu */}
          {!hideMenu && (
            <InvoiceRowCell
              style={{ width: 60, justifyContent: 'flex-end' }}
              className="no-click"
            >
              <div ref={el => { this.triggerRef = el; }}>
                <MenuTrigger
                  onClick={this.toggleMenu}
                  darkMode={darkMode}
                >
                  ⋯
                </MenuTrigger>
                {menuOpen && (
                  <DropdownMenu
                    ref={el => { this.menuRef = el; }}
                    darkMode={darkMode}
                    triggerTop={this.state.menuTop}
                  >
                    {invoice.status !== 'paid' && (
                      <MenuItem
                        onClick={() => setInvoiceStatus(invoice._id, 'paid')}
                        darkMode={darkMode}
                        style={{ color: darkMode ? '#4ADE80' : '#16A34A' }}
                      >
                        <FiCheck />
                        Mark as Paid
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => editInvoice(invoice)} darkMode={darkMode}>
                      <FiEdit />
                      Edit
                    </MenuItem>
                    <MenuItem onClick={() => duplicateInvoice(invoice)} darkMode={darkMode}>
                      <FiCopy />
                      Duplicate
                    </MenuItem>
                    <MenuItem
                      onClick={() => deleteInvoice(invoice._id)}
                      darkMode={darkMode}
                      style={{ color: darkMode ? '#F87171' : '#DC2626' }}
                    >
                      <FiTrash2 />
                      Delete
                    </MenuItem>
                    <div style={{ position: 'relative' }}>
                      <MenuItem
                        onClick={this.toggleSubMenu}
                        darkMode={darkMode}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        {this.state.showStatusSubMenu ? (
                          <FiChevronUp style={{ opacity: 0.3, fontSize: 16 }} />
                        ) : (
                          <FiChevronDown style={{ opacity: 0.3, fontSize: 16 }} />
                        )}
                        Change Status
                      </MenuItem>

                      {this.state.showStatusSubMenu && (
                        <SubMenu darkMode={darkMode} style={{ right: '100%', marginRight: 4 }}>
                          <MenuItem onClick={() => setInvoiceStatus(invoice._id, 'pending')} darkMode={darkMode}>
                            <FiClock />
                            Set as Pending
                          </MenuItem>
                          <MenuItem onClick={() => setInvoiceStatus(invoice._id, 'refunded')} darkMode={darkMode}>
                            <FiDollarSign />
                            Set as Refunded
                          </MenuItem>
                          <MenuItem onClick={() => setInvoiceStatus(invoice._id, 'cancelled')} darkMode={darkMode}>
                            <FiXCircle />
                            Set as Cancelled
                          </MenuItem>
                        </SubMenu>
                      )}
                    </div>
                  </DropdownMenu>
                )}
              </div>
            </InvoiceRowCell>
          )}
        </InvoiceRow>
      </div>
    );
  }
}

Invoice.propTypes = {
  dateFormat: PropTypes.string,
  deleteInvoice: PropTypes.func.isRequired,
  duplicateInvoice: PropTypes.func.isRequired,
  editInvoice: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
  setInvoiceStatus: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
  isSelected: PropTypes.bool,
  onToggleSelect: PropTypes.func.isRequired,
  hideCheckbox: PropTypes.bool,
  hideMenu: PropTypes.bool,
};

Invoice.defaultProps = {
  darkMode: false,
  isSelected: false,
  hideCheckbox: false,
  hideMenu: false,
};

export default Invoice;
