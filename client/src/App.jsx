import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Discovery from './pages/Discovery'
import Profile from './pages/Profile'
import Connections from './pages/Connections'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/feed" replace />} />
                <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                <Route path="/discover" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
