
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import './AppLayout.css';

function AppLayout() {
  const [sidebarOuverte, setSidebarOuverte] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar ouverte={sidebarOuverte} onFermer={() => setSidebarOuverte(false)} />

      {sidebarOuverte && (
        <div className="sidebar-overlay" onClick={() => setSidebarOuverte(false)} />
      )}

      <div className="app-layout-main">
        <Navbar onOuvrirMenu={() => setSidebarOuverte(true)} />
        <div className="app-layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;