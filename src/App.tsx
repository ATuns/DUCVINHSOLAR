import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProjectShowcase } from './components/ProjectShowcase';
import { BlogSection } from './components/BlogSection';
import { CompanyProfile } from './components/CompanyProfile';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminModal } from './components/AdminModal';
import { FloatingContact } from './components/FloatingContact';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Product Catalog First - Immediately visible on page load */}
          <ProductCatalog />

          {/* Hero & Ecosystem Overview Section */}
          <Hero />

          {/* Real-World Projects Showcase */}
          <ProjectShowcase />

          {/* Blog & Solar Knowledge Horizontal Carousel (Right after Featured Projects) */}
          <BlogSection />

          {/* Corporate Profile & Legal Transparency */}
          <CompanyProfile />

          {/* Contact, Hotline, Map & Inquiry Form */}
          <ContactSection />
        </main>

        {/* Corporate Footer */}
        <Footer />

        {/* Floating Quick Action Widget */}
        <FloatingContact />

        {/* Modals & Overlays */}
        <ProductDetailModal />
        <AdminModal />
      </div>
    </AppProvider>
  );
}
