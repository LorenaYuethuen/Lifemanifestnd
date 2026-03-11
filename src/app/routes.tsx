import React from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Energy } from './pages/Energy';
import { Database } from './pages/Database';
import { Routine } from './pages/Routine';
import { Sop } from './pages/Sop';
import { Sos } from './pages/Sos';
import { EnergyProvider } from './context/EnergyContext';

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <EnergyProvider>
        <Layout />
      </EnergyProvider>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "energy", Component: Energy },
      { path: "database", Component: Database },
      { path: "routine", Component: Routine },
      { path: "sop", Component: Sop },
      { path: "sos", Component: Sos },
    ],
  },
]);
