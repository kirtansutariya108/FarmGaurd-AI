import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { AppLayout } from '../components/layout/AppLayout';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { FeaturesPage } from '../pages/public/FeaturesPage';
import { HowItWorksPage } from '../pages/public/HowItWorksPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ContactPage } from '../pages/public/ContactPage';
import { LoginPage } from '../pages/public/LoginPage';
import { SignUpPage } from '../pages/public/SignUpPage';

// Authenticated Application Pages
import { DashboardPage } from '../pages/app/DashboardPage';
import { FarmsPage } from '../pages/app/FarmsPage';
import { FarmDetailsPage } from '../pages/app/FarmDetailsPage';
import { DiseaseScannerPage } from '../pages/app/DiseaseScannerPage';
import { CropHealthPage } from '../pages/app/CropHealthPage';
import { IrrigationAdvisorPage } from '../pages/app/IrrigationAdvisorPage';
import { WeatherPage } from '../pages/app/WeatherPage';
import { RecommendationsPage } from '../pages/app/RecommendationsPage';
import { HistoryPage } from '../pages/app/HistoryPage';
import { ScanDetailsPage } from '../pages/app/ScanDetailsPage';
import { NotificationsPage } from '../pages/app/NotificationsPage';
import { ProfilePage } from '../pages/app/ProfilePage';
import { SettingsPage } from '../pages/app/SettingsPage';
import { HelpSupportPage } from '../pages/app/HelpSupportPage';

export const router = createBrowserRouter([
  // Public Marketing Website
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'features', element: <FeaturesPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
    ],
  },
  // Authenticated Application Cockpit
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'farms', element: <FarmsPage /> },
      { path: 'farms/:farmId', element: <FarmDetailsPage /> },
      { path: 'scanner', element: <DiseaseScannerPage /> },
      { path: 'crop-health', element: <CropHealthPage /> },
      { path: 'irrigation', element: <IrrigationAdvisorPage /> },
      { path: 'weather', element: <WeatherPage /> },
      { path: 'recommendations', element: <RecommendationsPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'history/:scanId', element: <ScanDetailsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'help', element: <HelpSupportPage /> },
    ],
  },
  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
