
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import './AppLayout.css';

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout-main">
        <Navbar />
        <div className="app-layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;