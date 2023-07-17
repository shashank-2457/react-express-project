import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const Form = ({ handleFormSubmit, formData: initialFormData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm();
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch, setError, clearErrors } = methods;
  const [billPictureFile, setBillPictureFile] = useState(null);
  const [billPictureUrl, setBillPictureUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false); // State variable for tracking button disabled state
  let downloadUrl;

  const handleEdit = () => {
    navigate('/home');
  };

  const uploadFileToStorage = async (file) => {
    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      downloadUrl = await fileRef.getDownloadURL();
      console.log(downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.log('Error uploading file:', error);
      return null;
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    setBillPictureFile(file);
    setBillPictureUrl(URL.createObjectURL(file));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('Event Target:', event.target);
    console.log(name, value);
    setValue(name, value);
    clearErrors(name); // Clear any validation errors for the field
  };

  const onSubmit = async (data) => {
    try {
      if (!billPictureFile) {
        setError('billPicture', { type: 'required', message: 'Picture of Bill is required' });
        return;
      }

      downloadUrl = await uploadFileToStorage(billPictureFile);

      if (!downloadUrl) {
        setError('billPicture', { type: 'uploadError', message: 'Error uploading picture' });
        return;
      }

      const billData = {
        ...data,
        billPicture: downloadUrl,
      };
      const formData = new FormData();
      formData.append('uid', localStorage.getItem('userId'));
      formData.append('patientName', data.patientName);
      formData.append('patientAddress', data.patientAddress);
      formData.append('hospitalName', data.hospitalName);
      formData.append('dateOfService', data.dateOfService);
      formData.append('billAmount', data.billAmount);
      formData.append('billPicture', downloadUrl);
      const response = await axios.post('http://localhost:8000/api/bills', formData);

      await handleFormSubmit(billData);

      navigate('/summary', { state: { formData: data, billPictureUrl } });
    } catch (error) {
      console.log('Error submitting form:', error);
    }
  };

  useEffect(() => {
    if (location.state && location.state.formData) {
      const formData = location.state.formData;
      Object.keys(formData).forEach((key) => {
        console.log(key, formData[key]);
        if (key === 'dateOfService') {
          let dd = formData[key].getDate();
          let mm = formData[key].getMonth() + 1;
          let yyyy = formData[key].getFullYear();
          if (mm < 10) {
            mm = '0' + mm;
          }
          if (dd < 10) {
            dd = '0' + dd;
          }
          console.log(`${yyyy}-${mm}-${dd}`);
          setValue(key, `${yyyy}-${mm}-${dd}`);
        } else {
          setValue(key, formData[key]);
        }
      });
    }
  }, [location.state, setValue]);

  const disableDates = () => {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (mm < 10) {
      mm = '0' + mm;
    }
    if (dd < 10) {
      dd = '0' + dd;
    }
    console.log(`${yyyy}-${mm}-${dd}`);
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleButtonClick = async () => {
    setSubmitting(true);
    await handleSubmit(onSubmit)();
    setSubmitting(false);
  };

  return (
    <FormProvider {...methods}>
      <div className="container-form">
        <form className="card-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-group-label">Name:</label>
            <input
              type="text"
              {...register('patientName', { required: true })}
              className="form-group-input"
              name="patientName"
              onChange={handleInputChange}
            />
            {errors.patientName && <div className="form-group-error">Patient Name is required</div>}
          </div>
          <div className="form-group">
            <label className="form-group-label">Patient Address:</label>
            <input
              type="text"
              {...register('patientAddress', { required: true })}
              className="form-group-input"
              name="patientAddress"
              onChange={handleInputChange}
            />
            {errors.patientAddress && <div className="form-group-error">Patient Address is required</div>}
          </div>
          <div className="form-group">
            <label className="form-group-label">Hospital Name:</label>
            <input
              type="text"
              {...register('hospitalName', { required: true })}
              className="form-group-input"
              name="hospitalName"
              onChange={handleInputChange}
            />
            {errors.hospitalName && <div className="form-group-error">Hospital Name is required</div>}
          </div>
          <div className="form-group">
            <label>Date of Service:</label>
            <input
              type="date"
              id="dateOfService"
              name="dateOfService"
              {...register('dateOfService', { required: true })}
              className={`form-group-input${errors.dateOfService ? ' form-error' : ''}`}
              onChange={handleInputChange}
              max={disableDates()}
            />
            {errors.dateOfService && (
              <div className="form-group-error">Date of Service is required</div>
            )}
          </div>
          <div className="form-group">
            <label className="form-group-label">Bill Amount:</label>
            <input
              type="text"
              {...register('billAmount', { required: true, pattern: /^[1-9][0-9]*$/ })}
              className="form-group-input"
              name="billAmount"
              onChange={handleInputChange}
            />
            {errors.billAmount && errors.billAmount.type === 'required' && (
              <div className="form-group-error">Bill Amount is required</div>
            )}
            {errors.billAmount && errors.billAmount.type === 'pattern' && (
              <div className="form-group-error">Bill Amount must be a positive number</div>
            )}
          </div>
          <div className="form-group">
            <label className="form-group-label">Picture of Bill:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="form-group-file"
            //{...register('billPicture', { required: true })}
            />
            {errors.billPicture && errors.billPicture.type === 'required' && (
              <div className="form-group-error">Picture of Bill is required</div>
            )}
          </div>
          <div className="button-container">
          <button type="button" onClick={handleButtonClick} disabled={submitting} className="btn-form-primary">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            <button onClick={handleEdit} className="btn-form-secondary">
              Go Home
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default Form;
