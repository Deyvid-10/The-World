import {Outlet} from 'react-router-dom'

import MainNavBar from './MainNavBar';
import React from 'react';

function MainNavigation() {
  return (
    <>
      <MainNavBar/>
        <Outlet/>
    </>
  );
}

export default MainNavigation;