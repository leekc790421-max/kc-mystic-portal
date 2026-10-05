import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import StarField from './components/StarField';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TarotCards from './components/TarotCards';
import MayanTimeline from './components/MayanTimeline';
import Divination from './components/Divination';
import PaymentCTA from './components/PaymentCTA';
import EmailCapture from './components/EmailCapture';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import Chatbot from './components/Chatbot';

function AppContent() {
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { isPaid } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'true') {
      localStorage.setItem('kc_mp_paid', 'true');
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      <StarField count={120} />
      <Navbar onAuthClick={() => setAuthOpen(true)} onAdminClick={() => setAdminOpen(true)} />

      <main className="relative z-10">
        <HeroSection />
        <TarotCards />
        <MayanTimeline />
        <Divination />
        <EmailCapture />
        <PaymentCTA />
        <FAQ />
      </main>

      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
