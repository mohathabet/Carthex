// Libraries
import React from 'react';
import PropTypes from 'prop-types';

// Animation
import _withFadeInAnimation from '../../components/shared/hoc/_withFadeInAnimation';

// Styles
import styled from 'styled-components';
import {
  FormCard,
  FormLabel,
  FormInput,
  FormGrid,
  FormField
} from '../shared/FormStyles';

const RecipientFormWrapper = styled(FormCard)`
  margin-bottom: 0;
`;

export function RecipientForm({ t, formData, updateRecipientForm }) {
  const { fullname, company, email, phone } = formData;
  return (
    <RecipientFormWrapper>
      <FormGrid>
        <FormField>
          <FormLabel>{t('common:fields:fullname')} *</FormLabel>
          <FormInput
            name="fullname"
            type="text"
            value={fullname || ''}
            onChange={updateRecipientForm}
            placeholder={t('common:fields:fullname')}
          />
        </FormField>
        <FormField>
          <FormLabel>{t('common:fields:company')}</FormLabel>
          <FormInput
            name="company"
            type="text"
            value={company || ''}
            onChange={updateRecipientForm}
            placeholder={t('common:fields:company')}
          />
        </FormField>
      </FormGrid>
      <FormGrid>
        <FormField>
          <FormLabel>{t('common:fields:email')} *</FormLabel>
          <FormInput
            name="email"
            type="email"
            value={email || ''}
            onChange={updateRecipientForm}
            placeholder={t('common:fields:email')}
          />
        </FormField>
        <FormField>
          <FormLabel>{t('common:fields:phone')}</FormLabel>
          <FormInput
            name="phone"
            type="tel"
            value={phone || ''}
            onChange={updateRecipientForm}
            placeholder={t('common:fields:phone')}
          />
        </FormField>
      </FormGrid>
    </RecipientFormWrapper>
  );
}

// PropTypes Validation
RecipientForm.propTypes = {
  formData: PropTypes.object,
  t: PropTypes.func.isRequired,
  updateRecipientForm: PropTypes.func.isRequired,
};

RecipientForm.defaultProps = {
  formData: {},
};

export default _withFadeInAnimation(RecipientForm);
