import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import AIResponseManager from './components/AIResponseManager';
import { generateEssay, continueEssay } from './services/apiService';
import './index.css';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  const [genre, setGenre] = useState('');
  const [length, setLength] = useState('medium');
  const [theme, setTheme] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateEssay({ genre, length, theme });
      setAiResponse(response.response || response.text);
    } catch (err) {
      setError(err.message);
      console.error('Essay generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await continueEssay(aiResponse);
      setAiResponse(prevResponse => 
        prevResponse + '\n\n' + (response.response || response.text)
      );
    } catch (err) {
      setError(err.message);
      console.error('Essay continuation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAiResponse(null);
    setGenre('');
    setLength('medium');
    setTheme('');
    setError(null);
  };

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => handleReset()}
    >
      <div className="app-container">
        <header>
          <h1>Essay Generator</h1>
        </header>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {!aiResponse ? (
          <form onSubmit={handleSubmit} className="essay-config-form">
            <select 
              value={genre} 
              onChange={(e) => setGenre(e.target.value)}
              required
            >
              <option value="">Select Genre</option>
              <option value="academic">Academic</option>
              <option value="narrative">Narrative</option>
              <option value="persuasive">Persuasive</option>
              <option value="descriptive">Descriptive</option>
            </select>

            <select 
              value={length} 
              onChange={(e) => setLength(e.target.value)}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>

            <input 
              type="text" 
              placeholder="Theme or Topic" 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Essay'}
            </button>
          </form>
        ) : (
          <AIResponseManager 
            response={aiResponse}
            metadata={{
              genre,
              length,
              theme,
              generatedAt: new Date().toISOString()
            }}
            onContinue={handleContinue}
            onReset={handleReset}
            isLoading={isLoading}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
