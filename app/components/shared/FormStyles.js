import styled from 'styled-components';

// Common form styles
export const FormCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  transition: all 0.2s ease;
  background: white;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 16px;
  padding-right: 40px;

  font-size: 14px;
  line-height: normal; /* ✅ avoid issues from custom line-heights */
  height: auto;

  color: #1f2937;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  appearance: none;
  box-sizing: border-box;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;


export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  transition: all 0.2s ease;
  background: white;
  min-height: 100px;
  resize: vertical;
  

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const FormButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  color: white;

  background-color: ${({ variant }) =>
    variant === 'danger'
      ? '#ef4444'       // red-500
      : variant === 'secondary'
      ? '#10b981'       // green-500
      : '#3b82f6'};     // default = blue-500

  &:hover {
    background-color: ${({ variant }) =>
      variant === 'danger'
        ? '#dc2626'     // red-600
        : variant === 'secondary'
        ? '#059669'     // green-600
        : '#2563eb'};   // blue-600
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;
export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  margin-right: 24px; /* 👈 Add this line */

  input[type="radio"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    margin: 0;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;

    &:hover {
      border-color: #3b82f6;
    }

    &:checked {
      border-color: #3b82f6;
      background: #3b82f6;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      }
    }
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`; 