// Libraries
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// React Dates
import { SingleDatePicker } from 'react-dates';

// Custom Components
import {
  FormField,
  FormButton
} from '../shared/FormStyles';

// Animation
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';

// Styles
import styled from 'styled-components';

const DatePickerContainer = styled(FormField)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;

  .SingleDatePicker {
    flex: 1;
  }

  .SingleDatePickerInput {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
    color: #1f2937;
    transition: all 0.2s ease;
    background: white;

    &:hover {
      border-color: #d1d5db;
    }

    &:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`;

// Component
export class DueDatePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { focused: false };
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.clearDate = this.clearDate.bind(this);
  }

  onFocusChange() {
    this.setState({ focused: !this.state.focused });
  }

  onDateChange(date) {
    const selectedDate = date === null ? null : moment(date).toObject();
    this.props.updateCustomDate(selectedDate);
  }

  clearDate(e) {
    e.preventDefault();
    this.onDateChange(null);
  }

  render() {
    const { t, selectedDate } = this.props;
    const dueDate = selectedDate === null ? null : moment(selectedDate);
    return (
      <DatePickerContainer>
        <SingleDatePicker
          id="invoice-duedate"
          firstDayOfWeek={1}
          displayFormat={d =>
            d
              ? [
                  String(d.date()).padStart(2, '0'),
                  String(d.month() + 1).padStart(2, '0'),
                  d.year()
                ].join('/')
              : ''
          }
          renderDayContents={day => day.date()}
          hideKeyboardShortcutsPanel
          placeholder={t('form:fields:dueDate:placeHolder')}
          date={dueDate}
          focused={this.state.focused}
          onFocusChange={this.onFocusChange}
          onDateChange={newDate => this.onDateChange(newDate)}
        />
        {selectedDate !== null && (
          <FormButton variant="secondary" onClick={this.clearDate}>
            Clear
          </FormButton>
        )}
      </DatePickerContainer>
    );
  }
}

DueDatePicker.propTypes = {
  selectedDate: PropTypes.object,
  t: PropTypes.func.isRequired,
  updateCustomDate: PropTypes.func.isRequired,
};

DueDatePicker.defaultProps = {
  selectedDate: null,
};

// Export
export default _withFadeInAnimation(DueDatePicker);
