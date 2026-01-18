import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import DynamicPage from './components/DynamicPage';
import { FilterProvider } from './contexts/FilterContext';
import { DASHBOARD_CONFIG } from './config/dashboardStructure';

function App() {
  // Generate routes from pageLayouts
  const routes = Object.keys(DASHBOARD_CONFIG.pageLayouts).map((path) => ({
    path,
    element: <DynamicPage />,
  }));

  return (
    <FilterProvider>
      <BrowserRouter>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/faculty/load-summary" replace />} />
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<Navigate to="/faculty/load-summary" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </FilterProvider>
  );
}

export default App;
