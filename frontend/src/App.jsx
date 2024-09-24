import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ForgetPasswordUI from "./screens/auth/ForgetPasswordUI";
import LoginUI from "./screens/auth/LoginUI";
import RegistrationUI from "./screens/auth/RegistrationUI";

import CarparkUI from "./screens/Carpark/CarparkUI";
import FavouritesUI from "./screens/Favourites/FavouritesUI";
import SearchResultsUI from "./screens/SearchResults/SearchResultsUI";

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/auth/">
          <Route path="register" Component={RegistrationUI} />
          <Route path="login" Component={LoginUI} />
          <Route path="forget-password" Component={ForgetPasswordUI} />
        </Route>
        <Route path="/">
          <Route path="attractions" Component={SearchResultsUI} />
          <Route path="favourites" Component={FavouritesUI} />
          <Route path="carparks" Component={CarparkUI} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
