import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { TooltipProvider } from './components/common';

// // Layout Components
// import DashboardLayout from '@/components/layout/DashboardLayout';
// import AuthLayout from '@/components/layout/AuthLayout';
// import CustomerLayout from '@/components/layout/CustomerLayout';

// // Auth Pages
import LoginPage from './pages/auth/login/LoginPage';
import SignupPage from './pages/auth/Signup/Signup';
// import ForgotPasswordPage from '@/pages/auth/forgot-password/ForgotPasswordPage';

// // Admin/Agent Pages
import Dashboard from './pages/Admin/Dashboard';
import AgentDashboard from './pages/Agent/AgentDashboard';
import AddProperty from './pages/Admin/AddProperty';
import LeadsList from './pages/Admin/LeadsList';
import AgentLeads from './pages/Agent/AgentLeads';
// import LeadDetailPage from '@/pages/leads/lead-detail/LeadDetailPage';

// import PropertiesPage from '@/pages/properties/PropertiesPage';
// import PropertyDetailPage from '@/pages/properties/property-detail/PropertyDetailPage';
// import AddPropertyPage from '@/pages/properties/add-property/AddPropertyPage';
// import DealsPage from '@/pages/deals/DealsPage';
// import DealDetailPage from '@/pages/deals/deal-detail/DealDetailPage';
// import ActivitiesPage from '@/pages/activities/ActivitiesPage';
// import InvoicesPage from '@/pages/invoices/InvoicesPage';
// import InvoiceDetailPage from '@/pages/invoices/invoice-detail/InvoiceDetailPage';
// import TransactionsPage from '@/pages/transactions/TransactionsPage';

// import SettingsPage from '@/pages/settings/SettingsPage';
import Employees from './pages/Admin/EmployeeList';
// import ProfilePage from '@/pages/profile/ProfilePage';

// // Customer Portal Pages
// import CustomerDashboard from '@/pages/customer/dashboard/CustomerDashboard';
import Properties from './pages/Properties/Properties';
import PropertyDetail from './pages/PropertyDetail/PropertyDetail';
// import CustomerDealsPage from '@/pages/customer/deals/CustomerDealsPage';
// import CustomerInvoicesPage from '@/pages/customer/invoices/CustomerInvoicesPage';
// import CustomerDocumentsPage from '@/pages/customer/documents/CustomerDocumentsPage';

// // Public Pages
import Landing from './pages/Landing/Landing';
// import PropertiesListingPage from '@/pages/properties-listing/PropertiesListingPage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// 404 Page
import NotFoundPage from './pages/not-found/NotFoundPage';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
          <div className="App">
            <Routes>
              {/* All routes commented out for now - Team members will uncomment as they create components */}
              
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              {/* <Route path="/properties" element={<PropertiesListingPage />} /> */}
              
              {/* Auth Routes */}
              {/* <Route path="/auth" element={
                <PublicRoute>
                  <AuthLayout />
                </PublicRoute>
              }> */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                {/*<Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route index element={<Navigate to="login" replace />} />
              </Route> */}

              {/* Customer Portal Routes */}
              {/* <Route path="/customer" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerLayout />
                </ProtectedRoute>
              }> */}
                {/* <Route path="dashboard" element={<CustomerDashboard />} /> */}
                {/* Public access to properties - no login required */}
                <Route path="/properties" element={<Properties />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                {/* <Route path="deals" element={<CustomerDealsPage />} />
                <Route path="invoices" element={<CustomerInvoicesPage />} />
                <Route path="documents" element={<CustomerDocumentsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route> */}

              {/* Admin Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }>
                
                <Route index element={<Dashboard />} />
              </Route>
              
              {/* Agent Dashboard Routes */}
              <Route path="/agent/dashboard" element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentDashboard />
                </ProtectedRoute>
              } />
              
              {/* Agent Leads Route */}
              <Route path="/agent/leads" element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentLeads />
                </ProtectedRoute>
              } />
               <Route path="/admin/employees" element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <Employees />
                </ProtectedRoute>
              }></Route>
              
              {/* Admin Properties Route - not protected as it handles auth internally */}
              <Route path="/admin/properties" element={<Properties />} />
              
              {/* Admin Add Property Route - Protected for admin only */}
              <Route path="/admin/properties/add" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddProperty />
                </ProtectedRoute>
              } />
              
              {/* Alternative Add Property Route - Protected for admin only */}
              <Route path="/addproperty" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddProperty />
                </ProtectedRoute>
              } />
              
              {/* Leads Routes - Admin only */}
              <Route path="/admin/leads" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <LeadsList />
                </ProtectedRoute>
              } />
              
              {/* Old Leads Routes */}
              {/* <Route path="/leads" element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<LeadsPage />} />
                <Route path=":id" element={<LeadDetailPage />} />
              </Route> */}

              {/* Clients Routes */}
              {/* <Route path="/clients" element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ClientsPage />} />
                <Route path=":id" element={<ClientDetailPage />} />
              </Route> */}

              {/* Properties Routes */}
              {/* <Route path="/admin/properties" element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<PropertiesPage />} />
                <Route path="add" element={<AddPropertyPage />} />
                <Route path=":id" element={<PropertyDetailPage />} />
              </Route> */}

              {/* Deals Routes */}
              {/* <Route path="/deals" element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DealsPage />} />
                <Route path=":id" element={<DealDetailPage />} />
              </Route> */}

              {/* Activities Routes */}
              {/* <Route path="/activities" element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ActivitiesPage />} />
              </Route> */}

              {/* Invoices Routes */}
              {/* <Route path="/invoices" element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<InvoicesPage />} />
                <Route path=":id" element={<InvoiceDetailPage />} />
              </Route> */}

              {/* Transactions Routes */}
              {/* <Route path="/transactions" element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<TransactionsPage />} />
              </Route> */}

              {/* Reports Routes */}
              {/* <Route path="/reports" element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ReportsPage />} />
              </Route> */}

              {/* Settings Routes */}
              {/* <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<SettingsPage />} />
              </Route> */}

              {/* Profile Route */}
              {/* <Route path="/profile" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ProfilePage />} />
              </Route> */}

              {/* 404 Route - Keep this active */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/* Toast Notifications with Sonner */}
            <Toaster
              position="top-right"
              expand={true}
              richColors={true}
              closeButton={true}
              toastOptions={{
                duration: 4000,
                style: {
                  fontSize: '14px',
                },
                className: 'sonner-toast',
              }}
            />
          </div>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;