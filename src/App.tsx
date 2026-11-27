import React from 'react';
import { MotionConfig, motion } from 'motion/react';
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
import { SitemapPage } from './components/SitemapPage';

const MainPageRouter: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <main className="flex-1 relative z-10 pt-[4.25rem] sm:pt-[5rem]">

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

      {currentPage === 'sitemap' && <SitemapPage />}
    </main>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-slate-50/95 via-emerald-50/35 to-sky-50/45 text-slate-800 antialiased font-sans selection:bg-emerald-500 selection:text-white">
          {/* Ambient Luminous Bubble Orbs in Background for Glassmorphism Depth */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden backdrop-blur-[2px]"
            aria-hidden="true"
          >
            <div className="animate-orb-slow absolute -top-28 -left-28 w-[28rem] h-[28rem] rounded-full bg-emerald-200/20 blur-[120px]" />
            <div className="animate-orb-reverse absolute top-1/4 -right-32 w-[32rem] h-[32rem] rounded-full bg-teal-200/18 blur-[130px]" />
            <div className="animate-orb-slow absolute top-2/3 left-1/4 w-[30rem] h-[30rem] rounded-full bg-amber-100/20 blur-[120px]" />
            <div className="animate-orb-reverse absolute -bottom-36 right-1/3 w-[28rem] h-[28rem] rounded-full bg-emerald-300/15 blur-[130px]" />
          </motion.div>

          {/* Navigation Bar */}
          <Header />

          {/* Route-Aware Standalone or Home Content */}
          <MainPageRouter />

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
    </MotionConfig>
  );
}
