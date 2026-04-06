import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SignUpConfirmationPage from "./pages/SignUpConfirmationPage";
import DashboardHome from "./pages/DashboardHome";
import AboutPage from "./pages/AboutPage";
import ThemePreviewPage from "./pages/ThemePreviewPage";
import ProgressIndicatorPreview from "./pages/ProgressIndicatorPreview";
import BusinessComingSoon from "./pages/business/BusinessComingSoon";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import PropertiesPage from "./pages/business/PropertiesPage";
import PropertyDetailPage from "./pages/business/PropertyDetailPage";
import AddPropertyPage from "./pages/business/AddPropertyPage";
import FleetPage from "./pages/business/FleetPage";
import VehicleDetailPage from "./pages/business/VehicleDetailPage";
import AddVehiclePage from "./pages/business/AddVehiclePage";
import FileClaimPage from "./pages/business/FileClaimPage";
import MakePaymentPage from "./pages/business/MakePaymentPage";
import MapPage from "./pages/business/MapPage";
import DashboardSelector from "./pages/financial/DashboardSelector";
import FinancialDashboardV1 from "./pages/financial/FinancialDashboardV1";
import FinancialDashboardV2 from "./pages/financial/FinancialDashboardV2";
import FinancialDashboardV3 from "./pages/financial/FinancialDashboardV3";
import AssetDetailView from "./pages/financial/AssetDetailView";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/confirmation" element={<SignUpConfirmationPage />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/theme-preview" element={<ThemePreviewPage />} />
        <Route path="/progress-preview" element={<ProgressIndicatorPreview />} />

        {/* Business Routes */}
        <Route path="/business" element={<Navigate to="/business/dashboard" replace />} />
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        <Route path="/business/properties" element={<PropertiesPage />} />
        <Route path="/business/properties/add" element={<AddPropertyPage />} />
        <Route path="/business/properties/:propertyId" element={<PropertyDetailPage />} />
        <Route path="/business/fleet" element={<FleetPage />} />
        <Route path="/business/fleet/add" element={<AddVehiclePage />} />
        <Route path="/business/fleet/:vehicleId" element={<VehicleDetailPage />} />
        <Route path="/business/map" element={<MapPage />} />
        <Route path="/business/claims" element={<BusinessComingSoon />} />
        <Route path="/business/payments" element={<BusinessComingSoon />} />
        <Route path="/business/file-claim" element={<FileClaimPage />} />
        <Route path="/business/make-payment" element={<MakePaymentPage />} />

        {/* Financial Analytics Dashboard Routes */}
        <Route path="/financial" element={<Navigate to="/financial/select" replace />} />
        <Route path="/financial/select" element={<DashboardSelector />} />
        <Route path="/financial/v1" element={<FinancialDashboardV1 />} />
        <Route path="/financial/v2" element={<FinancialDashboardV2 />} />
        <Route path="/financial/v3" element={<FinancialDashboardV3 />} />
        <Route path="/financial/asset/:assetId" element={<AssetDetailView />} />
      </Routes>
    </Layout>
  );
}
