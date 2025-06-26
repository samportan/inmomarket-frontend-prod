// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Layout from './components/Layout'
import NotificationsList from './pages/Notifications'
import Favorites from "@/pages/publications/Favorites.jsx";
import Settings from './pages/Settings'
import PublicationsList from './pages/publications/PublicationsList'
import { PropertyRoute } from './components/PropertyRoute'
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import MyPublications from './pages/publications/MyPublications'
import CreatePublication from './pages/publications/CreatePublication'
import Reports from './pages/Reports'

export default function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        {/* Public Routes - no sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes - wrapped with sidebar layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<NotificationsList />} />
          <Route path="/property/:id/:slug?" element={<PropertyRoute />} />
          <Route path="/publications" element={<PublicationsList />} />
          <Route path="/my-publications" element={<MyPublications />} />
          <Route path="/my-publications/create" element={<CreatePublication />} />
          <Route path="/reportes" element={<Reports />} />
          {/* Add more protected pages here */}
        </Route>
      </Routes>
    </AuthProvider>
  )
}
