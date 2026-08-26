import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Todos from "./pages/Todos.jsx";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/todos" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/todos"
            element={
              <Protected>
                <Todos />
              </Protected>
            }
          />
          <Route path="/" element={<Navigate to="/todos" replace />} />
          <Route
            path="/login"
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnly>
                <Signup />
              </PublicOnly>
            }
          />
          <Route path="*" element={<Navigate to="/todos" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}