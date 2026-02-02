import React from 'react'
import LeftSidebar from './components/LeftSidebar.jsx'
import { Outlet } from 'react-router-dom'
import TopNavbar from './components/TopNavbar.jsx'
import "./Dashboard.css";
const DashboardLayout = () => {
  return (
    <div className='dashboard-layout'>
        <TopNavbar/>
        <div className='dashboard-body'>
        <LeftSidebar/>
        <main className='dashboard-content'>
            <Outlet/>
        </main>
        </div>
      
    </div>
  )
}

export default DashboardLayout
