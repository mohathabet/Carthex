// React Libraries
import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
import moment from 'moment';
import { calTermDate } from '../../../../helpers/date';

// Styles
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: ${props => props.language === 'ar' ? 'row-reverse' : 'row'};
  text-align: ${props => props.language === 'ar' ? 'right' : 'left'};
`;

const Heading = styled.h1`
  font-family: 'Lora', 'Songti SC', serif;
  font-size: 2.1em;
  font-weight: 400;
  margin-bottom: 1em;
  color: #2c323a;
  ${(props) =>
    props.customAccentColor &&
    `
    color: ${props.accentColor};
  `}
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  height: auto;
  ${(props) =>
    props.logoSize &&
    `
    max-width: ${props.logoSize}%;
  `}
  img {
    width: 100%;
  }
`;

function Header({ t, invoice, profile, configs }) {
  const { language, logoSize, accentColor, customAccentColor, documentType } = configs;
  const { dueDate } = invoice;

  // Set moment locale globally for this component
  moment.locale(language);

  // Default fallback if translation for documentType is missing
  const docTypeLabel = t(`preview:common:${documentType || 'invoice'}`, { lng: language });

  return (
    <Wrapper language={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <Heading accentColor={accentColor} customAccentColor={customAccentColor}>
          {docTypeLabel}
        </Heading>

        <h4 className="label">
          # {invoice.invoiceID || truncate(invoice._id, { length: 8, omission: '' })}
        </h4>

        <p>
          {t('preview:common:created', { lng: language })}:{' '}
          {moment(invoice.created_at).format(configs.dateFormat)}
        </p>

        {dueDate && (
          <div>
            <p>
              {t('preview:common:due', { lng: language })}:{' '}
              {dueDate.useCustom
                ? moment(dueDate.selectedDate).format(configs.dateFormat)
                : moment(calTermDate(invoice.created_at, dueDate.paymentTerm)).format(
                    configs.dateFormat
                  )}
            </p>

            {!dueDate.useCustom && (
              <p>
                ({t(`form:fields:dueDate:paymentTerms:${dueDate.paymentTerm}:description`, { lng: language })})
              </p>
            )}
          </div>
        )}
      </div>

      {configs.showLogo && (
        <Logo logoSize={logoSize}>
          <img src={profile.logo} alt="Logo" />
        </Logo>
      )}
    </Wrapper>
  );
}

Header.propTypes = {
  configs: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default Header;
