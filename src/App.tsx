import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { AllTools } from './pages/AllTools';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      window.scrollTo(0, 0); // Scroll to top on navigation
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Determine what page to render based on hash
  const renderPage = () => {
    if (currentHash === '#/tools') {
      return <AllTools />;
    }
    // Default to Home page
    return <Home />;
  };

  return (
    <>
      <Header />
      <main>
        {renderPage()}
      </main>
      {/* Footer will go here */}
    </>
  );
}

export default App;
