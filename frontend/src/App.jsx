import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";

import LoginUI from "./pages/LoginUI"; 
import RegistrationUI from "./pages/RegistrationUI";
import SortFilterUI from "./pages/SortFilterUI";
import CarparkUI from "./pages/CarparkUI";
import FavouritesUI from "./pages/FavouritesUI";
import ForgetPasswordUI from "./pages/ForgetPasswordUI";
import SearchResultsUI from "./pages/SearchResultsUI";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function App() {
  // State to hold search results and selected location
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<LoginUI />} />

        {/* Auth Routes */}
        <Route path="/auth/register" element={<RegistrationUI />} />
        <Route path="/auth/forget-password" element={<ForgetPasswordUI />} />

        {/* Protected Routes */}
        <Route
          path="/sort-filter"
          element={
            <ProtectedRoute>
              <SortFilterUI setSearchResults={setSearchResults} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-results"
          element={
            <ProtectedRoute>
              <SearchResultsUI results={searchResults} setSelectedLocation={setSelectedLocation} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carparks"
          element={
            <ProtectedRoute>
              <CarparkUI selectedLocation={selectedLocation} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <FavouritesUI />
            </ProtectedRoute>
          }
        />

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
