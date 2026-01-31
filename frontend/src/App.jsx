import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SidebarLayout from './layouts/SidebarLayout.jsx';
import CreateNotePage from './pages/CreateNotePage.jsx';
import AllNotesPage from './pages/AllNotesPage.jsx';
import ImportantPage from './pages/ImportantPage.jsx';
import TrashPage from './pages/TrashPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/create-note" replace />} />
        <Route path="/home" element={<Navigate to="/create-note" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/create-note" element={<CreateNotePage />} />
          <Route path="/all-notes" element={<AllNotesPage />} />
          <Route path="/important" element={<ImportantPage />} />
          <Route path="/trash" element={<TrashPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
