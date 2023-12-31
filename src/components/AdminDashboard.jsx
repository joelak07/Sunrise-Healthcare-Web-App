import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import './admindashboard.css'
import { toast, ToastContainer } from 'react-toastify';

function AdminDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    doctorId: "",
    doctorName: "",
    specialization: "",
    qualification: "",
    password: "",
  });
  const [displayDoctors, setDisplayDoctors] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [patients, setPatients] = useState([]);
  const [displaySearch, setDisplaySearch] = useState(true);

  // State for tracking whether the update form is displayed
  const [displayUpdateForm, setDisplayUpdateForm] = useState(false);

  // State to store the details of the doctor being updated
  const [updatingDoctor, setUpdatingDoctor] = useState({
    doctorId: "",
    doctorName: "",
    specialization: "",
    qualification: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("doctordbtoken");
    if (!token) {
      // Redirect to login if token not present
      navigate("/login");
    } else {
      // Fetch user role from token (assuming it's stored as decoded in your case)
      const decodedToken = decodeToken(token);
      if (decodedToken.role !== "admin") {
        // Redirect if user role is not admin
        navigate("/error");
      } else {
        // Fetch the list of doctors and patients when the component mounts
        fetchDoctors();
        fetchAllPatients();
      }
    }
  }, [navigate]);

  const decodeToken = (token) => {
    // Implement token decoding logic here (if not already implemented)
    // JWT decoding
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(base64));
    return decoded;
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("https://hospital-appointment-backend.onrender.com/doctor");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchAllPatients = async () => {
    try {
      const response = await fetch("https://hospital-appointment-backend.onrender.com/patient");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prevDoctor) => ({ ...prevDoctor, [name]: value }));
  };

  const handleCreateDoctor = async () => {
    try {
      const response = await fetch(
        "https://hospital-appointment-backend.onrender.com/doctor/createDoctor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDoctor),
        }
      );

      if (response.ok) {
        // If the doctor is created successfully, fetch the updated list
        toast.success("Doctor profile created");
        await fetchDoctors();
        // Clear the form fields
        setNewDoctor({
          doctorId: "",
          doctorName: "",
          specialization: "",
          qualification: "",
          password: "",
        });
      } else {
        console.error("Error creating doctor:", await response.json());
        toast.error("Error in creating profile");
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
      toast.error("Error in creating profile");
    }
  };

  const handleUpdateDoctor = async () => {
    try {
      const response = await fetch(
        `https://hospital-appointment-backend.onrender.com/doctor/updateDoctor/${updatingDoctor._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatingDoctor),
        }
      );

      if (response.ok) {
        // If the doctor is updated successfully, fetch the updated list
        toast.success("Doctor updated");
        await fetchDoctors();
        // Hide the update form after successful update
        setDisplayUpdateForm(false);
        // Clear the updatingDoctor state
        setUpdatingDoctor({
          doctorId: "",
          doctorName: "",
          specialization: "",
          qualification: "",
        });
      } else {
        toast.error("Error in updation");
        console.error("Error updating doctor:", await response.json());
      }
    } catch (error) {
      toast.error("Error in updation");
      console.error("Error updating doctor:", error);
    }
  };

  const handleUpdateClick = (doctor) => {
    setUpdatingDoctor({
      doctorId: doctor.doctorId,
      doctorName: doctor.doctorName,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      _id: doctor._id,
    });
    setDisplayUpdateForm(true);
    setDisplayDoctors(false);
  };

  const handleCancelUpdate = () => {
    setUpdatingDoctor({
      doctorId: "",
      doctorName: "",
      specialization: "",
      qualification: "",
    });
    setDisplayUpdateForm(false);
    setDisplayDoctors(true);
  };

  const handleDeleteDoctor = async (id) => {
    try {
      const response = await fetch(
        `https://hospital-appointment-backend.onrender.com/doctor/deleteDoctor/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // If the doctor is deleted successfully, fetch the updated list
        toast.success("Doctor deleted");
        await fetchDoctors();
      } else {
        console.error("Error deleting doctor:", await response.json());
        toast.error("Deletion error");
      }
    } catch (error) {
      toast.error("Deletion error");
      console.error("Error deleting doctor:", error);
    }
  };

  const handleSearchPatients = async () => {

    try {
      const response = await fetch(
        `https://hospital-appointment-backend.onrender.com/patient/getPatient?patientName=${searchCriteria}`
      );
      const data = await response.json();
      setPatients(data);
      setDisplaySearch(false);
      setShowDetails(true);
    } catch (error) {
      console.error("Error searching patients:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchCriteria("");
    setDisplaySearch(true);
  };

  const handleToggleDisplayDoctors = () => {
    setDisplayDoctors(!displayDoctors);
  };

  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    if (showDetails) {
      handleClearSearch();
    }
  };

  const ListItems = () => {
    if (!Array.isArray(patients)) {
      return [];
    }
    return patients.map((patient) => {
      return <li key={patient._id}>
        {patient.patientName} - {patient.email}
      </li>
    });
  };

  return (
    <div className="admindash">
      <AdminNav />
      <h2 className="admh2">Admin Dashboard</h2>
      <div className="createdoc">
        <h3>Create New Doctor</h3>
        <div className="crdoc-row1">
          <div className="crdoc1">
            <label>Doctor ID:</label>
            <input
              type="text"
              name="doctorId"
              value={newDoctor.doctorId}
              onChange={handleInputChange}
              placeholder="Enter Doctor ID"
            />
          </div>
          <div className="crdoc2">
            <label>Doctor Name:</label>
            <input
              type="text"
              name="doctorName"
              value={newDoctor.doctorName}
              onChange={handleInputChange}
              placeholder="Enter Doctor Name"
            />
          </div>
          <div className="crdoc3">

            <label>Specialization:</label>
            <input
              type="text"
              name="specialization"
              value={newDoctor.specialization}
              onChange={handleInputChange}
              placeholder="Enter Specialization"
            />
          </div>
        </div>

        <div className="crdoc-row2">
          <div className="crdoc4">
            <label>Qualification:</label>
            <input
              type="text"
              name="qualification"
              value={newDoctor.qualification}
              onChange={handleInputChange}
              placeholder="Enter Qualification"
            />
          </div>
          <div className="crdoc5">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={newDoctor.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
            />
          </div>
        </div>

        <button onClick={handleCreateDoctor}>Create Doctor</button>
      </div>
      <br />
      <br />
      <div className="dispdoc">
        <h3>Doctor List</h3>
        <button onClick={handleToggleDisplayDoctors} className="disphead">
          {displayDoctors ? "Hide Doctors" : "Display All Doctors"}
        </button>
        {displayDoctors && (
          <div className="dispdocin" >
            <ul>
              {doctors.map((doctor) => (
                <li key={doctor._id}>
                  {doctor.doctorName} - {doctor.specialization}
                  <div className="dispdocinbut">
                    <button onClick={() => handleUpdateClick(doctor)} className="docupd">
                      Update
                    </button>
                    <button onClick={() => handleDeleteDoctor(doctor._id)} className="docdel">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        )}
      </div>

      {displayUpdateForm && (
        <div className="updtdoc">
          <h3>Update Doctor</h3>
          <div className="updrow-1">
            <div className="updsub1">
              <label>Doctor ID:</label>
              <input
                type="text"
                name="doctorId"
                value={updatingDoctor.doctorId}
                onChange={(e) =>
                  setUpdatingDoctor({ ...updatingDoctor, doctorId: e.target.value })
                }
              />
            </div>
            <div className="updsub2">
              <label>Doctor Name:</label>
              <input
                type="text"
                name="doctorName"
                value={updatingDoctor.doctorName}
                onChange={(e) =>
                  setUpdatingDoctor({
                    ...updatingDoctor,
                    doctorName: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="updrow-2">
            <div className="updsub3">
              <label>Specialization:</label>
              <input
                type="text"
                name="specialization"
                value={updatingDoctor.specialization}
                onChange={(e) =>
                  setUpdatingDoctor({
                    ...updatingDoctor,
                    specialization: e.target.value,
                  })
                }
              />
            </div>
            <div className="updsub4">
              <label>Qualification:</label>
              <input
                type="text"
                name="qualification"
                value={updatingDoctor.qualification}
                onChange={(e) =>
                  setUpdatingDoctor({
                    ...updatingDoctor,
                    qualification: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <button onClick={handleUpdateDoctor} className="docupd">Update Doctor</button>
          <button onClick={handleCancelUpdate} className="updclose">Cancel Update</button>
        </div>
      )}
      <br />
      <br />
      <div className="patcont">
        <h3>Search Patients</h3>
        <input
          type="text"
          placeholder="Search by name"
          value={searchCriteria}
          onChange={(e) => setSearchCriteria(e.target.value)}
        />
        {displaySearch ? (
          <button onClick={() => { handleSearchPatients(); toggleDetails(); }} className="patsearch">
            Search
          </button>

        ) : (
          <button onClick={() => { handleClearSearch(); toggleDetails(); }} className="patsearch">Clear Search</button>
        )}

        <button onClick={toggleDetails} className="patbtn">
          {showDetails ? 'Hide Patients' : 'Display All Patients'}
        </button>

        {showDetails && (
          <div className="patdetails">
            <ul>
              {patients.length === 0 ? (
                <p style={{ color: '#000', textAlign: 'center', margin: '120px', fontSize: '1.9rem' }}>No patients</p>
              ) : (
                ListItems()
              )}
            </ul>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;
