import React from 'react';
import PropTypes from 'prop-types';
import { Section, Label } from '../shared';

function DocumentType({ documentType, handleInputChange }) {
  return (
    <Section>
      <Label>Document Type</Label>
      <select name="documentType" value={documentType} onChange={handleInputChange}>
        <option value="facture">Facture</option>
        <option value="recu">Reçu de Paiement</option>
        <option value="bon">Bon de Livraison</option>
        <option value="devis">Devis</option>
      </select>
    </Section>
  );
}

DocumentType.propTypes = {
  documentType: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default DocumentType; 