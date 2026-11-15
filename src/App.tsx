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
      <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-sky-50/80 text-slate-800 antialiased font-sans selection:bg-emerald-500 selection:text-white">
        {/* Ambient Luminous Bubble Orbs in Background for Glassmorphism Depth */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-300/35 blur-3xl" />
          <div className="absolute top-1/4 -right-28 w-[28rem] h-[28rem] rounded-full bg-teal-300/30 blur-3xl" />
          <div className="absolute top-2/3 left-1/4 w-[26rem] h-[26rem] rounded-full bg-amber-200/25 blur-3xl" />
          <div className="absolute -bottom-32 right-1/3 w-96 h-96 rounded-full bg-emerald-400/25 blur-3xl" />
        </div>

        {/* Navigation Bar (Direct child: div#root > div > header) */}
        <Header />

        {/* Main Content Area (padded for fixed floating header) */}
        <main className="flex-1 relative z-10 pt-[4.25rem] sm:pt-[5rem]">
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
        <div className="relative z-10">
          <Footer />
        </div>

        {/* Floating Quick Action Widget */}
        <FloatingContact />

        {/* Modals & Overlays */}
        <ProductDetailModal />
        <AdminModal />
      </div>
    </AppProvider>
  );
}
