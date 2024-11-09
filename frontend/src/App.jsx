import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import LoginUI from "./pages/LoginUI";
import RegistrationUI from "./pages/RegistrationUI";
import SortFilterUI from "./pages/SortFilterUI";
import CarparkUI from "./pages/CarparkUI";
import FavouritesUI from "./pages/FavouritesUI";
import ForgetPasswordUI from "./pages/ForgetPasswordUI";
import SearchResultsUI from "./pages/SearchResultsUI";
import ChangePasswordUI from "./pages/ChangePasswordUI"; 
import api from './api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import PasswordResetUI from './pages/PasswordResetUI';


function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (!accessToken && !refreshToken) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/verify-token', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          throw new Error('Access token expired or invalid');
        }
      } catch (error) {
        console.error('Access token invalid or expired, attempting refresh:', error);

        try {
          const refreshResponse = await api.post('/api/token/refresh/', { refresh: refreshToken });

          if (refreshResponse.status === 200) {
            const { access } = refreshResponse.data;
            localStorage.setItem(ACCESS_TOKEN, access);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.clear();
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          setIsAuthenticated(false);
          localStorage.clear();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginUI />} />
        <Route path="/auth/register" element={<RegistrationUI />} />
        <Route path="/auth/forget-password" element={<ForgetPasswordUI />} />
        <Route path="/password-reset/:token" element={<PasswordResetUI/>}/>
        <Route path="/change-password" 
               element={
                 <ProtectedRoute isAuthenticated={isAuthenticated}>
                   <ChangePasswordUI />
                 </ProtectedRoute>
               } 
        />
        <Route
          path="/sort-filter"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SortFilterUI setSearchResults={setSearchResults} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-results"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SearchResultsUI
                results={searchResults}
                setSelectedLocation={setSelectedLocation}
                setLocationName={setLocationName}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carparks"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CarparkUI selectedLocation={selectedLocation} locationName={locationName} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FavouritesUI />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;