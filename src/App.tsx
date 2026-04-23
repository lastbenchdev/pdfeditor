import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { AllTools } from './pages/AllTools';
import { Editor } from './pages/Editor';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);

      // Only scroll to top on non-editor routes
      if (!window.location.hash.startsWith('#/editor')) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isEditorRoute = currentHash.startsWith('#/editor') || currentHash.startsWith('#/tools/');

  // Determine what page to render based on hash
  const renderPage = () => {
    if (currentHash === '#/tools') {
      return <AllTools />;
    }

    if (currentHash.startsWith('#/editor')) {
      return <Editor routeHash={currentHash} />;
    }
    
    // Backward compatibility: redirect old tool URLs into editor context.
    if (currentHash.startsWith('#/tools/')) {
      const toolId = currentHash.replace('#/tools/', '');
      window.location.hash = `#/editor?tool=${toolId}`;
      return <Editor routeHash={`#/editor?tool=${toolId}`} />;
    }

    // Default to Home page
    return <Home />;
  };

  return (
    <div className={isEditorRoute ? 'editor-active' : ''}>
      <Header />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
