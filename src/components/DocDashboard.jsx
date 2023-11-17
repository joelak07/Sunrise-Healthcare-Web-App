import React from 'react'
import DocNav from './DocNav'
import './docdashboard.css'
import AppointmentObj from './AppointmentObj'

const DocDashboard = () => {
  return (
    <div className='maindoc'>
        <DocNav/>
        <div className="doccontainer">
            <h2>Appointments for the day</h2>
            <div className="dailyap">
              <AppointmentObj/>
            </div>
        </div>
    </div>
  )
}


export default DocDashboard