// React Libraries
import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
const moment = require('moment');

// Helper
import { calTermDate } from '../../../../helpers/date';

// Styles
import styled from 'styled-components';

const InvoiceHeader = styled.div`
  flex: 1;
  flex: none;
  display: flex;
  justify-content: space-between;

  /* when we're inside <Invoice dir='rtl'> ... */
  [dir='rtl'] & {
    flex-direction: row-reverse;   /* logo on the "right" */
    text-align: right;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const Company = styled.div`
  margin-bottom: 1.66667em;

  /* centre the little heading line (label) */
  .label {
    align-self: center;
    text-align: center;
  }

  /* hard-left alignment for paragraph lines when parent <Invoice dir="rtl"> */
  [dir='rtl'] & p {
    direction: ltr;
    text-align: left;
    align-self: flex-start;
  }
`;

const Recipient = styled.div`
  .label {
    align-self: center;
    text-align: center;
  }

  /* same paragraph tweak in RTL */
  [dir='rtl'] & p {
    direction: ltr;
    text-align: left;
    align-self: flex-start;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  h4 {
    font-size: 1.16667em;
    color: #dbbd8a;
    margin: 0;
    font-weight: 300;
  }
  p {
    text-transform: capitalize;
  }
`;

const Heading = styled.h1`
  margin: 0 0 10px 0;
  font-size: 2em;
  font-weight: 400;
  color: #cbc189;
  text-transform: uppercase;
  letter-spacing: 1px;
  /* occupy the full row and always hug the right edge */
  width: 100%;
  text-align: right;          /* works for both LTR & RTL */
  align-self: flex-end;       /* stay flush with the column edge */

  word-break: break-word;          /* allow safe wrapping */

  ${p =>
    p.customAccentColor &&
    `
    color: ${p.accentColor};
  `};
`;

// Component
function Header({ t, invoice, profile, configs }) {
  const { tax, recipient } = invoice;
  const {
    language,
    accentColor,
    customAccentColor,
    documentType,
  } = configs;

  const docTypeLabel = t(
    `preview:common:${documentType || 'invoice'}`,
    { lng: language }
  );

  // Style override for meta lines (ID + dates) in Arabic
  const metaStyle =
    language === 'ar'
      ? { direction: 'ltr', textAlign: 'left', alignSelf: 'flex-start' }
      : {};

  return (
    <InvoiceHeader>
      <LeftColumn>
        <Company>
          <h4 style={{ direction: 'ltr', textAlign: 'left', alignSelf: 'flex-start' }}>
            {profile.company}
          </h4>
          <p>{profile.fullname}</p>
          <p>{profile.address}</p>
          <p>{profile.email}</p>
          <p>{profile.phone}</p>
          { tax && <p>Tax ID: { tax.tin }</p> }
        </Company>

        {configs.showRecipient && (
          <Recipient>
            <h4 style={{ direction: 'ltr', textAlign: 'left', alignSelf: 'flex-start' }}>
              {t('preview:common:billedTo', { lng: language })}
            </h4>
            <p>{recipient.company}</p>
            <p>{recipient.fullname}</p>
            <p>{recipient.email}</p>
            <p>{recipient.phone}</p>
          </Recipient>
        )}
      </LeftColumn>
      <RightColumn>
        <Heading
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          accentColor={accentColor}
          customAccentColor={customAccentColor}
        >
          {docTypeLabel}
        </Heading>
        <h4 style={metaStyle}>
          #{invoice.invoiceID
            ? invoice.invoiceID
            : truncate(invoice._id, {
                length: 8,
                omission: '',
              })}
        </h4>
        <p style={metaStyle}>
          {t('preview:common:created', { lng: language })}:{' '}
          {moment(invoice.created_at)
            .locale(language)
            .format(configs.dateFormat)}
        </p>
        {invoice.dueDate && [
          <p key="dueDate" style={metaStyle}>
            {t('preview:common:due', { lng: language })}:{' '}
            {invoice.dueDate.useCustom
              ? moment(invoice.dueDate.selectedDate)
                  .locale(language)
                  .format(configs.dateFormat)
              : moment(
                  calTermDate(invoice.created_at, invoice.dueDate.paymentTerm)
                )
                  .locale(language)
                  .format(configs.dateFormat)}
          </p>,
          <p key="dueDateNote">
            {!invoice.dueDate.useCustom &&
              `
            (
              ${t(
                `form:fields:dueDate:paymentTerms:${
                  invoice.dueDate.paymentTerm
                }:description`,
                { lng: language }
              )}
            )
            `}
          </p>,
        ]}
      </RightColumn>
    </InvoiceHeader>
  );
}

Header.propTypes = {
  configs: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default Header;
