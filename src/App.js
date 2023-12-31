import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Appointment from "./components/Appointment";
import Home from "./components/Home";
import Footer from "./components/Footjer";
import Status from "./components/Status";
import Error from "./components/Error";
import Otp from "./components/Otp";
import VerifiedStatus from "./components/VerifiedStatus";
import Confirmed from "./components/Confirmed";
import AdminDashboard from "./components/AdminDashboard";
import "react-toastify/dist/ReactToastify.css";
import DocDashboard from "./components/DocDashboard";
import DocProfile from "./components/DocProfile";
import Test from "./components/Test";
import MyAppointments from "./components/MyAppointments";
import About from "./components/About";
import PrevStatus from "./components/PrevStatus";

function App() {
  return (
    <div>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/profile" element={<DocProfile />} />
          <Route path="/doctor/dashboard" element={<DocDashboard />} />
          <Route path="/status" element={<Status />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/patient/otp" element={<Otp />} />
          <Route path="/verifiedStatus" element={<VerifiedStatus />} />
          <Route path="/previousStatus" element={<PrevStatus />} />
          <Route path="/confirmed" element={<Confirmed />} />
          <Route path="/test" element={<Test />} />
          <Route path="/doctor/appointments" element={<MyAppointments />} />
          <Route path="/*" element={<Error />} />
        </Routes>
        <Footer />
      </HashRouter>
    </div>
  );
}

export default App;
