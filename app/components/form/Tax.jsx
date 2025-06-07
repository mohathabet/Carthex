// Libraries
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
// Custom Components
import { Section } from '../shared/Section';
import {
  FormCard,
  FormLabel,
  FormInput,
  FormSelect,
  FormGrid,
  FormField,
  FormActions,
  FormButton
} from '../shared/FormStyles';
// Animation
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';
// Styles
import styled from 'styled-components';
import { Part, Row, Field } from '../shared/Part';
const TaxID = styled.div``;
const TaxAmount = styled.div`flex: 1;`;

// Component
export class Tax extends PureComponent {
  constructor(props) {
    super(props);
    this.state = props.tax;
    this.isSettingsSaved = this.isSettingsSaved.bind(this);
    this.saveAsDefault = this.saveAsDefault.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // Handle Form Clear
  componentWillReceiveProps(nextProps) {
    // Already made changes but not saved
    if (this.state !== this.props.savedSettings) {
      // Reset to savedSettings if the below confition is met
      if (nextProps.tax === nextProps.savedSettings) {
        this.setState(nextProps.savedSettings, () => {
          this.updateTaxState();
        });
      }
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = name === 'amount' ? parseFloat(target.value) : target.value;
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.updateTaxState();
      }
    );
  }

  updateTaxState() {
    const { updateFieldData } = this.props;
    updateFieldData('tax', this.state);
  }

  isSettingsSaved() {
    return isEqual(this.state, this.props.savedSettings);
  }

  saveAsDefault(e) {
    e.preventDefault();
    const { updateSavedSettings } = this.props;
    updateSavedSettings('tax', this.state);
  }

  render() {
    const { t } = this.props;
    return (
      <Section>
        <FormCard>
          <FormLabel>{t('form:fields:tax:name')}</FormLabel>
          <FormGrid>
            <FormField>
              <FormLabel>{t('form:fields:tax:id')}</FormLabel>
              <FormInput
                name="tin"
                type="text"
                value={this.state.tin}
                onChange={this.handleInputChange}
                placeholder={t('form:fields:tax:id')}
              />
            </FormField>
          </FormGrid>
          <FormGrid>
            <FormField>
              <FormLabel>{t('common:amount')} (%)</FormLabel>
              <FormInput
                name="amount"
                type="number"
                step="0.01"
                value={this.state.amount}
                onChange={this.handleInputChange}
                placeholder={t('common:amount')}
              />
            </FormField>
            <FormField>
              <FormLabel>{t('form:fields:tax:method')}</FormLabel>
              <FormSelect
                name="method"
                value={this.state.method}
                onChange={this.handleInputChange}
              >
                <option value="default">{t('common:default')}</option>
                <option value="reverse">{t('form:fields:tax:reverse')}</option>
              </FormSelect>
            </FormField>
          </FormGrid>
          {!this.isSettingsSaved() && (
            <FormActions>
              <FormButton variant="secondary" onClick={this.saveAsDefault}>
                {t('common:saveAsDefault')}
              </FormButton>
            </FormActions>
          )}
        </FormCard>
      </Section>
    );
  }
}

Tax.propTypes = {
  updateSavedSettings: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  tax: PropTypes.object.isRequired,
  savedSettings: PropTypes.object.isRequired,
  updateFieldData: PropTypes.func.isRequired,
};

// Exports
export default _withFadeInAnimation(Tax);
