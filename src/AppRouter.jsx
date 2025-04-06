import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import Browse from "./pages/Browse";
import AppShell from "./layouts/AppShell";
import ApartmentDetails from "./pages/ApartmentDetails";
import CreateReview from "./pages/CreateReview";
import MyApartments from "./pages/MyApartments";
import CreateApartment from "./pages/CreateApartment";
import EditApartment from "./pages/EditApartment";
import EmailVerification from "./pages/EmailVerification";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />

        <Route
          path="/browse"
          element={
            <PrivateRoute>
              <AppShell>
                <Browse />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/apartments/:id"
          element={
            <PrivateRoute>
              <AppShell>
                <ApartmentDetails />
              </AppShell>
            </PrivateRoute>
          }
        />

        <Route
          path="/reviews/create/:id"
          element={
            <PrivateRoute>
              <AppShell>
                <CreateReview />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-apartments"
          element={
            <PrivateRoute>
              <AppShell>
                <MyApartments />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/apartments/new"
          element={
            <PrivateRoute>
              <AppShell>
                <CreateApartment />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/apartments/edit/:id"
          element={
            <PrivateRoute>
              <AppShell>
                <EditApartment />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
