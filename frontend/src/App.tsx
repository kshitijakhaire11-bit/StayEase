/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen, TransitionDirection, Hotel } from './types';
import { HOTELS_DATA } from './data/hotels';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './screens/HomeScreen';
import { SearchResultsScreen } from './screens/SearchResultsScreen';
import { HotelDetailsScreen } from './screens/HotelDetailsScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { AdminDashboard } from './screens/AdminDashboard';
import { AdminLoginScreen, AdminAuthSession } from './screens/AdminLoginScreen';
import { CustomerLoginScreen, CustomerUser } from './screens/CustomerLoginScreen';
import { OffersScreen } from './screens/OffersScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [previousCustomerScreen, setPreviousCustomerScreen] = useState<Screen>('home');
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>('push');
  const [selectedHotel, setSelectedHotel] = useState<Hotel>(HOTELS_DATA[3]); // Default Taj Exotica
  const [destination, setDestination] = useState<string>('Mumbai, India');

  // Administrator Session State (Protected, segregated from customer portal)
  const [adminSession, setAdminSession] = useState<AdminAuthSession | null>(null);

  // Customer Loyalty & Authenticated State
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);

  // Listen for #admin, #offers, or #login URL hash or keyboard shortcut for authorized staff
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentScreen('admin');
      } else if (window.location.hash === '#login') {
        openCustomerLogin();
      } else if (window.location.hash === '#offers') {
        handleNavigate('offers', 'push');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey: Ctrl+Shift+A or Cmd+Shift+A for authorized staff portal access
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentScreen('admin');
      }
    };

    if (window.location.hash === '#admin') {
      setCurrentScreen('admin');
    } else if (window.location.hash === '#login') {
      openCustomerLogin();
    } else if (window.location.hash === '#offers') {
      handleNavigate('offers', 'push');
    }

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openCustomerLogin = () => {
    if (currentScreen !== 'login' && currentScreen !== 'admin') {
      setPreviousCustomerScreen(currentScreen);
    }
    handleNavigate('login', 'push');
  };

  const handleNavigate = (screen: Screen, transition: TransitionDirection = 'push') => {
    if (screen === 'login' && currentScreen !== 'login' && currentScreen !== 'admin') {
      setPreviousCustomerScreen(currentScreen);
    }
    setTransitionDirection(transition);
    setCurrentScreen(screen);
    if (screen !== 'admin' && window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
  };

  const handleAdminLoginSuccess = (session: AdminAuthSession) => {
    setAdminSession(session);
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    handleNavigate('home', 'push_back');
  };

  const handleCustomerLoginSuccess = (user: CustomerUser) => {
    setCustomerUser(user);
    // Return customer to the screen they were previously viewing
    const returnTarget = previousCustomerScreen === 'login' ? 'home' : previousCustomerScreen;
    handleNavigate(returnTarget, 'push_back');
  };

  const handleCancelCustomerLogin = () => {
    const returnTarget = previousCustomerScreen === 'login' ? 'home' : previousCustomerScreen;
    handleNavigate(returnTarget, 'push_back');
  };

  const getAnimationVariants = () => {
    if (transitionDirection === 'push') {
      return {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 },
      };
    }
    if (transitionDirection === 'push_back') {
      return {
        initial: { x: '-100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0 },
      };
    }
    if (transitionDirection === 'slide_up') {
      return {
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '-100%', opacity: 0 },
      };
    }
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  };

  const variants = getAnimationVariants();

  // Admin Screen Routing: Protected by Secure Admin Login Screen
  if (currentScreen === 'admin') {
    if (!adminSession) {
      return (
        <AdminLoginScreen
          onLoginSuccess={handleAdminLoginSuccess}
          onCancel={() => handleNavigate('home', 'push_back')}
        />
      );
    }

    return (
      <AdminDashboard
        adminSession={adminSession}
        onLogout={handleAdminLogout}
        onSwitchToGuestPortal={() => handleNavigate('home', 'push_back')}
      />
    );
  }

  // Customer Login Screen Routing: Dedicated Full Split-Screen Experience
  if (currentScreen === 'login') {
    return (
      <CustomerLoginScreen
        onLoginSuccess={handleCustomerLoginSuccess}
        onCancel={handleCancelCustomerLogin}
        previousScreen={previousCustomerScreen}
        searchContext={{
          destination,
          dates: '24 Oct - 27 Oct, 2024',
          guests: '2 Guests, 1 Suite',
          hotel: selectedHotel,
        }}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#c5a059]/30 selection:text-white overflow-x-hidden font-sans">
      {/* Customer-Facing Clean Header (No Admin Controls) */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenCustomerLogin={openCustomerLogin}
        customerUser={customerUser}
        onCustomerLogout={() => setCustomerUser(null)}
      />

      {/* Screen View with Motion Transitions */}
      <div className="flex-grow flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentScreen}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-grow flex flex-col w-full"
          >
            {currentScreen === 'home' && (
              <HomeScreen
                onNavigate={handleNavigate}
                destination={destination}
                setDestination={setDestination}
                onOpenCustomerLogin={openCustomerLogin}
              />
            )}

            {currentScreen === 'search_results' && (
              <SearchResultsScreen
                onNavigate={handleNavigate}
                onSelectHotel={handleSelectHotel}
                destination={destination}
                setDestination={setDestination}
              />
            )}

            {currentScreen === 'hotel_details' && (
              <HotelDetailsScreen
                hotel={selectedHotel}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'offers' && (
              <OffersScreen
                onNavigate={handleNavigate}
                onSelectHotel={handleSelectHotel}
                onOpenCustomerLogin={openCustomerLogin}
                customerUser={customerUser}
              />
            )}

            {currentScreen === 'checkout' && (
              <CheckoutScreen
                hotel={selectedHotel}
                onNavigate={handleNavigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Shared Luxury Footer with Discreet Staff Terminal Entry */}
      <Footer
        onOpenStaffPortal={() => handleNavigate('admin', 'push')}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
