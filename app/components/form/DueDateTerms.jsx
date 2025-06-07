// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import {
  FormField,
  FormSelect
} from '../shared/FormStyles';

// Animation
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';

// Payment Terms
import { paymentTerms } from '../../../libs/paymentTerms';

// Component
export class DueDateTerms extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    if (this.props.paymentTerm === null) {
      this.updateSelectedTerm(paymentTerms[0]);
    }
  }

  handleInputChange(event) {
    this.updateSelectedTerm(event.target.value);
  }

  updateSelectedTerm(term) {
    const { updatePaymentTerm } = this.props;
    updatePaymentTerm(term);
  }

  render() {
    const { t, paymentTerm } = this.props;
    const termOptions = paymentTerms.map(term => (
      <option key={term} value={term}>
        { t(`form:fields:dueDate:paymentTerms:${term}:label`) }
        {' - '}
        { t(`form:fields:dueDate:paymentTerms:${term}:description`) }
      </option>
    ));
    return (
      <FormField>
        <FormSelect
          onChange={this.handleInputChange}
          value={paymentTerm === null ? paymentTerms[0] : paymentTerm}
        >
          { termOptions }
        </FormSelect>
      </FormField>
    );
  }
}

DueDateTerms.propTypes = {
  paymentTerm: PropTypes.string,
  t: PropTypes.func.isRequired,
  updatePaymentTerm: PropTypes.func.isRequired,
};

// Export
export default _withFadeInAnimation(DueDateTerms);

