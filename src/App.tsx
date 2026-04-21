import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { AllTools } from './pages/AllTools';
import { ToolDetail } from './pages/ToolDetail';

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
    
    // Check for tool detail route: #/tools/:id
    if (currentHash.startsWith('#/tools/')) {
      const toolId = currentHash.replace('#/tools/', '');
      return <ToolDetail toolId={toolId} />;
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
    </>
  );
}

export default App;
