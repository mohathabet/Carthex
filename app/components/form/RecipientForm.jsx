// Libraries
import React from 'react';
import PropTypes from 'prop-types';

// Animation
import _withFadeInAnimation from '../../components/shared/hoc/_withFadeInAnimation';

// Styles
import styled from 'styled-components';
import { Part, Row, Field } from '../shared/Part';

export function RecipientForm({ t, formData, updateRecipientForm }) {
  const { fullname, company, email, phone } = formData;
  return (
    <Part>
      <Row>
        <Field>
          <label className="itemLabel">{t('common:fields:fullname')} *</label>
          <input
            className="form-control"
            name="fullname"
            type="text"
            value={fullname || ''}
            onChange={updateRecipientForm}
            placeholder={t('common:fields:fullname')}
          />
        </Field>
        <Field>
          <label className="itemLabel">{t('common:fields:company')}</label>
          <input
            className="form-control"
            name="company"
            type="text"
            value={company || ''}
            onChange={updateRecipientForm}
            placeholder={t('common:fields:company')}
          />
        </Field>
      </Row>
      <Row>
        <Field>
          <label className="itemLabel">{t('common:fields:email')} *</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={email || ''}
            onChange={updateRecipientForm}
            placeholder={t('common:fields:email')}
          />
        </Field>
        <Field>
          <label className="itemLabel">{t('common:fields:phone')}</label>
          <input
            className="form-control"
            name="phone"
            type="tel"
            value={phone || ''}
            onChange={updateRecipientForm}
            placeholder={t('common:fields:phone')}
          />
        </Field>
      </Row>
    </Part>
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
