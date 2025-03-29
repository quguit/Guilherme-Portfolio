
import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigation, Navigate, BrowserRouter } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoutes from "./components/ProtectedRoute"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}
function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes> 
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
