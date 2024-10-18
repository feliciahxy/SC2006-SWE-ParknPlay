import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginUI from "./screens/auth/LoginUI"; 
import ForgetPasswordUI from "./screens/auth/ForgetPasswordUI";
import RegistrationUI from "./screens/auth/RegistrationUI/RegistrationUI";

import CarparkUI from "./screens/Carpark/CarparkUI";
import FavouritesUI from "./screens/Favourites/FavouritesUI";
import SearchResultsUI from "./screens/SearchResults/SearchResultsUI";
import SortFilterUI from './screens/SortFilter/SortFilterUI';
import ProtectedRoute from './components/ProtectedRoute'; 

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< Updated upstream
        <Route path="/" Component={LandingUI} />
        <Route path="/auth/">
          <Route path="register" Component={RegistrationUI} />
          <Route path="login" Component={LoginUI} />
          <Route path="forget-password" Component={ForgetPasswordUI} />
        </Route>
        <Route path="/">
          <Route path="sort-filter" Component={SortFilterUI} />
          <Route path="search-results" Component={SearchResultsUI} />
          <Route path="favourites" Component={FavouritesUI} />
          <Route path="carparks" Component={CarparkUI} />
        </Route>
=======
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
              <SortFilterUI />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-results"
          element={
            <ProtectedRoute>
              <SearchResultsUI />
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
        <Route
          path="/carparks"
          element={
            <ProtectedRoute>
              <CarparkUI />
            </ProtectedRoute>
          }
        />

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />
>>>>>>> Stashed changes
      </Routes>
    </BrowserRouter>
  );
}

export default App;
