import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import DiscoveryPage from './pages/DiscoveryPage'
import ExplorePage from './pages/ExplorePage'
import NetworkPage from './pages/NetworkPage'
import ProfilePage from './pages/ProfilePage'
import MessagingPage from './pages/MessagingPage'
import SavedPosts from './pages/SavedPosts'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SettingsPage from './pages/SettingsPage'
import MessagingOverlay from './components/MessagingOverlay'

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Landing />} />
                
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
                </Route>

                <Route element={<MainLayout />}>
                    <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                    <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
                    <Route path="/discover" element={<ProtectedRoute><DiscoveryPage /></ProtectedRoute>} />
                    <Route path="/network" element={<ProtectedRoute><NetworkPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/messaging" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
                    <Route path="/saved" element={<ProtectedRoute><SavedPosts /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}
