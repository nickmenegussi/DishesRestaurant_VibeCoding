import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./context/AuthContext";
import { MenuProvider } from "./context/MenuContext";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
import { RequireAuth } from "./components/auth/RequireAuth";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
// import { ThemeProvider } from './context/ThemeContext';

// Feature Pages
import DishList from "./features/menu/DishList";
import DashboardOverview from "./features/dashboard/DashboardOverview";
import DishForm from "./features/menu/DishForm";
import LoginForm from "./features/auth/LoginForm";
// import RegisterForm from "./features/auth/RegisterForm";
import PublicMenu from "./features/public/PublicMenu";
import LandingPage from "./features/public/LandingPage";
import DishDetail from "./features/public/DishDetail";
import CartPage from "./features/public/CartPage";
import OrderList from "./features/orders/OrderList";
import ReservationList from "./features/reservations/ReservationList";
import LocationList from "./features/locations/LocationList";
import SettingsPage from "./features/settings/SettingsPage";
import FavoritesPage from "./features/public/FavoritesPage";
// import AnalyticsDashboard from "./features/reports/AnalyticsDashboard";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import AnalyticsDashboard from "./features/reports/AnalyticsDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <ToastProvider>
            <FavoritesProvider>
            <CartProvider>
              <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/menu" element={<PublicMenu />} />
                <Route path="/dish/:slug" element={<DishDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Route>

              {/* Auth Routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginForm />} />
                {/* <Route path="register" element={<RegisterForm />} /> */}
              </Route>

              {/* Admin Routes (Protected) */}
              <Route path="/admin" element={
                <RequireAuth>
                  <AnalyticsProvider>
                    <AdminLayout />
                  </AnalyticsProvider>
                </RequireAuth>
              }>
                <Route path="dashboard" element={<DashboardOverview />} />
                <Route path="reports" element={<AnalyticsDashboard />} />
                <Route path="menu" element={<DishList />} />
                <Route path="menu/add" element={<DishForm />} />
                <Route path="menu/edit/:id" element={<DishForm />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="reservations" element={<ReservationList />} />
                <Route path="locations" element={<LocationList />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CartProvider>
            </FavoritesProvider>
          </ToastProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
