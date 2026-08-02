
import Notifications from './Pages/SuperAdmin/Notifications/Notifications';
import Paiements from './Pages/SuperAdmin/Paiements/Paiements';
import Commerces from './Pages/SuperAdmin/Commerces/Commerces';
import DashboardGlobal from './Pages/SuperAdmin/DashboardGlobal/DashboardGlobal';
import SuperAdminLayout from './components/SuperAdminLayout/SuperAdminLayout';
import Profil from './Pages/Profil/Profil';
import SousComptes from './Pages/SousComptes/SousComptes';
import Clients from './Pages/Clients/Clients';
import Produits from './Pages/Produits/Produits';
import Commandes from './Pages/Commandes/Commandes';
import Inscription from './Pages/Inscription/Inscription';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout/AppLayout';
import Landing from './Pages/Landing/Landing';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import RouteProtegee from './components/RouteProtegee/RouteProtegee';
import { CommercantProvider } from './context/CommercantContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques, sans sidebar/navbar */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        {/* Pages de l'espace Admin, avec sidebar/navbar */}
        <Route
          element={
            <RouteProtegee>
              <CommercantProvider>
                <AppLayout />
              </CommercantProvider>
            </RouteProtegee>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/sous-comptes" element={<SousComptes />} />
          <Route path="/profil" element={<Profil />} />
        </Route>
        <Route
          element={
            <RouteProtegee>
              <SuperAdminLayout />
            </RouteProtegee>
          }
        >
          <Route path="/admin/dashboard" element={<DashboardGlobal />} />
          <Route path="/admin/commerces" element={<Commerces />} />
          <Route path="/admin/paiements" element={<Paiements />} />
          <Route path="/admin/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;