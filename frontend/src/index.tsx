import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from './source/Navbar';
import Personal from './source/Personal';

const router = [
  {
    path: '/personal',
    element: <Personal/>
  }
];

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Navbar data={router.map((data) => data.path )}/>
    <RouterProvider router={createBrowserRouter(router)}/>
  </React.StrictMode>
);

