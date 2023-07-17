import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: { formData, billPictureUrl } = {} } = location;

  const handleEdit = () => {
    const parsedDateOfService = formData.dateOfService ? new Date(formData.dateOfService) : null;
    const updatedFormData = {
      ...formData,
      dateOfService: parsedDateOfService instanceof Date ? parsedDateOfService : null,
    };
    navigate('/form', { state: { formData: updatedFormData, billPictureUrl }, replace: true });
  };

  const { patientName, patientAddress, hospitalName, dateOfService, billAmount } = formData || {};
  const formattedDate = dateOfService ? new Date(dateOfService).toLocaleDateString('en-US') : 'Not specified';

  return (
    <div className="summary-container">
      <div className="summary-card">
        <h2 className="summary-title">Summary</h2>
        <div className="summary-field">
          <strong>Patient Name:</strong> {patientName}
        </div>
        <div className="summary-field">
          <strong>Patient Address:</strong> {patientAddress}
        </div>
        <div className="summary-field">
          <strong>Hospital Name:</strong> {hospitalName}
        </div>
        <div className="summary-field">
          <strong>Date of Service:</strong> {formattedDate}
        </div>
        <div className="summary-field">
          <strong>Bill Amount:</strong> ${billAmount}
        </div>
        {billPictureUrl && (
          <div className="summary-image">
            <p>
              <strong>Picture of Bill:</strong>
            </p>
            <div className="image-container">
              <img src={billPictureUrl} alt="Bill" className="bill-image" />
            </div>
          </div>
        )}
        <br />
        <button onClick={handleEdit} className="summary-button">
          Edit
        </button>
      </div>
    </div>
  );
};

export default Summary;
