import React, { useEffect, useState } from 'react';
import './docdashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import Axios from 'axios';

const AppointmentObj = (props) => {
  const {
    _id,
    patientName,
    email,
    slot,
    reasonforappointment,
    appointmentDate
  } = props.obj;
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientAge, setPatientAge] = useState(null);
  const [diagnosisMessage, setDiagnosisMessage] = useState('');

  const calculateAge = (dob) => {
    const currentDate = new Date();
    const birthDate = new Date(dob);

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const cancelAppointment = () => {
    Axios.delete(`https://hospital-appointment-backend.onrender.com/appointment/deleteAppointment/${_id}`)
      .then((res) => {
        if (res.status === 200) {
          alert('Deleted successfully');
          window.location.reload();
        } else {
          Promise.reject();
        }
      })
      .catch((err) => alert(err));
  };

  const handleDiagnosisChange = (event) => {
    setDiagnosisMessage(event.target.value);
  };

  const sendDiagnosis = async () => {
    try {
      const formattedMessage = diagnosisMessage.replace(/[\r\n]+/g, '<br/>');

      const response = await Axios.post(
        `https://hospital-appointment-backend.onrender.com/appointment/sendDiagnosis/${_id}`,
        { message: formattedMessage }
      );

      if (response.status === 200) {
        toast.success('Diagnosis sent successfully');
        setDiagnosisMessage('');
      } else {
        toast.error('Failed to send');
      }
    } catch (err) {
      toast.error('Failed to send');
    }
  };

  const completeAppointment = async () => {
    try {
      const response = await Axios.put(`https://hospital-appointment-backend.onrender.com/appointment/completeAppointment/${_id}`);
      if (response.status === 200) {
        toast.success('Appointment completed');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error('Error has occurred');
      }
    } catch (err) {
      toast.error('Error has occurred');
    }
  };

  useEffect(() => {
    Axios.get('https://hospital-appointment-backend.onrender.com/patient/getPatient', {
      params: { email: email, patientName: patientName },
    })
      .then((res) => {
        if (res.status === 200 && res.data.length > 0) {
          setPatientDetails(res.data[0]);
        }
      })
      .catch((err) => console.error('Error fetching patient details:', err));
  }, [email, patientName]);

  useEffect(() => {
    if (patientDetails && patientDetails.dob) {
      const age = calculateAge(patientDetails.dob);
      setPatientAge(age);
    }
  }, [patientDetails]);

  return (
    <div className='appobj'>
      <h3>Patient Name: {patientName}</h3>
      <p>
        <b>Age: </b>
        {patientAge !== null ? patientAge : 'N/A'}
      </p>
      <p>
        <b>Reason for Appointment:</b> {reasonforappointment}
      </p>
      <p>
        <b>Appointment Date: </b>
        {new Date(appointmentDate).toLocaleDateString('en-GB')}
      </p>
      <p>
        <b>Slot Time:</b> {slot}
      </p>

      {showDiagnosis && (
        <div className='diag'>
          <h3>Your diagnosis</h3>
          <textarea
            name='diagnosisMessage'
            value={diagnosisMessage}
            onChange={handleDiagnosisChange}
            cols='159'
            rows='7'
          ></textarea>
          <button className='send-report-button' style={{ backgroundColor: 'green' }} onClick={sendDiagnosis}>
            Send Report
          </button>
          <button className='session-completed-button' style={{ backgroundColor: 'green' }} onClick={completeAppointment}>
            Session Completed
          </button>
          <br />
          <br />
        </div>
      )}

      <button onClick={cancelAppointment}>Cancel Appointment</button>
      <button onClick={() => setShowDiagnosis(!showDiagnosis)}>
        {showDiagnosis ? 'Close' : 'View Appointment'}
      </button>
      <ToastContainer />
    </div>
  );
};

export default AppointmentObj;
