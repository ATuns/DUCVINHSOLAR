import React from 'react';
import { MotionConfig } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
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

const MainPageRouter: React.FC = () => {
  const { currentPage, selectedProduct } = useApp();

  if (selectedProduct) {
    return (
      <main className="flex-1 relative z-10 pt-[4.25rem] sm:pt-[5rem] bg-white">
        <ProductDetailModal />
      </main>
    );
  }

  return (
    <main className="flex-1 relative z-10 pt-[4.25rem] sm:pt-[5rem] bg-white">
      {currentPage === 'home' && (
        <>
          <ProductCatalog />
          <Hero />
          <ProjectShowcase />
          <BlogSection />
          <CompanyProfile />
          <ContactSection />
        </>
      )}

      {currentPage === 'products' && <ProductCatalog />}

      {currentPage === 'projects' && <ProjectShowcase />}

      {currentPage === 'blog' && <BlogSection />}

      {currentPage === 'company' && (
        <>
          <CompanyProfile />
          <Hero />
        </>
      )}

      {currentPage === 'contact' && <ContactSection />}
    </main>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <div className="relative min-h-screen flex flex-col bg-white text-[#363636] antialiased font-sans selection:bg-[#FFBD00]/30 selection:text-[#1C1C1C] overflow-x-clip">
          {/* Floating Frosted Bubble Navigation Bar */}
          <Header />

          {/* Route-Aware Standalone or Home Content */}
          <MainPageRouter />

          {/* Corporate Floating Frosted Footer */}
          <div className="relative z-10 bg-white">
            <Footer />
          </div>

          {/* Floating Quick Action Bubbles */}
          <FloatingContact />

          {/* Modals & Overlays */}
          <AdminModal />
        </div>
      </AppProvider>
    </MotionConfig>
  );
}
