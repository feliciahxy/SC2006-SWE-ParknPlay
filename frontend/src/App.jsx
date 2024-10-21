import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingUI from "./screens/landing/LandingUI";

import ForgetPasswordUI from "./screens/auth/ForgetPasswordUI/ForgetPasswordUI";
import LoginUI from "./screens/auth/LoginUI";
import RegistrationUI from "./screens/auth/RegistrationUI/RegistrationUI";
import ChangePasswordUI from './screens/auth/ForgetPasswordUI/ChangePasswordUI';

import FavouritesUI from "./screens/Favourites/FavouritesUI";
import SearchResultsUI from "./screens/SearchResults/SearchResultsUI";

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={LandingUI} />
        <Route path="/auth/">
          <Route path="register" Component={RegistrationUI} />
          <Route path="forget-password" Component={ForgetPasswordUI} />
          <Route path="change-password" Component={ChangePasswordUI} />
          <Route path="login" Component={LoginUI} />
        </Route>
        <Route path="/">
          <Route path="search-results" Component={SearchResultsUI} />
          <Route path="favourites" Component={FavouritesUI} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
