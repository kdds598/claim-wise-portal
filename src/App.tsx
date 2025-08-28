import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import { store, RootState } from './store';
import Layout from './components/Layout';
import Login from './components/Login';
import CustomerDashboard from './components/dashboards/CustomerDashboard';
import AgentDashboard from './components/dashboards/AgentDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Login />;
  }

  const getDashboard = () => {
    switch (user?.role) {
      case 'customer':
        return <CustomerDashboard />;
      case 'agent':
        return <AgentDashboard />;
      case 'administrator':
        return <AdminDashboard />;
      default:
        return <NotFound />;
    }
  };

  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={getDashboard()} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
