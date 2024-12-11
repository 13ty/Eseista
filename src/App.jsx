import React, { useState } from 'react';
    import axios from 'axios';
    import { saveAs } from 'file-saver';

    function App() {
      const [genre, setGenre] = useState('');
      const [length, setLength] = useState('');
      const [mood, setMood] = useState('');
      const [audience, setAudience] = useState('');
      const [theme, setTheme] = useState('');
      const [template, setTemplate] = useState('');
      const [apiAddress, setApiAddress] = useState('http://localhost:7860/api/generate');
      const [apiKey, setApiKey] = useState('');

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(apiAddress, {
            genre,
            length,
            mood,
            audience,
            theme,
            template
          }, {
            headers: {
              'Authorization': `Bearer ${apiKey}`
            }
          });
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.error(error);
          return null;
        }
      };

      const handleImport = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json, .pdf, .mm';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = async (event) => {
            const content = event.target.result;
            try {
              const data = JSON.parse(content);
              setGenre(data.genre || '');
              setLength(data.length || '');
              setMood(data.mood || '');
              setAudience(data.audience || '');
              setTheme(data.theme || '');
              setTemplate(data.template || '');
            } catch (error) {
              console.error('Invalid file format');
            }
          };
          reader.readAsText(file);
        };
        input.click();
      };

      const handleSaveJSON = async () => {
        const essay = await handleSubmit();
        if (!essay) return;
        const blob = new Blob([JSON.stringify(essay, null, 2)], { type: 'application/json' });
        saveAs(blob, 'essay.json');
      };

      const handleSavePDF = async () => {
        // Implement PDF saving logic here
        console.log('Saving as PDF...');
      };

      const handleSaveMindMap = async () => {
        // Implement Mind Map saving logic here
        console.log('Saving as Mind Map...');
      };

      return (
        <div className="container">
          <h1>Essay Generator</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Genre:
              <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            </label>
            <br />
            <label>
              Length:
              <input type="text" value={length} onChange={(e) => setLength(e.target.value)} required />
            </label>
            <br />
            <label>
              Mood:
              <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} required />
            </label>
            <br />
            <label>
              Audience:
              <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} required />
            </label>
            <br />
            <label>
              Theme:
              <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} required />
            </label>
            <br />
            <label>
              Template:
              <select value={template} onChange={(e) => setTemplate(e.target.value)}>
                <option value="">Select a template</option>
                <option value="academic">Academic</option>
                <option value="personal">Personal</option>
                <option value="fictional">Fictional</option>
              </select>
            </label>
            <br />
            <button type="submit">Generate Essay</button>
          </form>

          <div className="actions">
            <button onClick={handleImport}>Import Idea from File</button>
            <button onClick={handleSaveJSON}>Save as JSON</button>
            <button onClick={handleSavePDF}>Save as PDF</button>
            <button onClick={handleSaveMindMap}>Save as Mind Map</button>
          </div>

          <div className="options">
            <button>Create Another One</button>
            <button>Continue This Idea</button>
          </div>

          <h2>Advanced Settings</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              API Address:
              <input type="text" value={apiAddress} onChange={(e) => setApiAddress(e.target.value)} required />
            </label>
            <br />
            <label>
              API Key:
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
            </label>
            <br />
            <button onClick={() => proposeAdditionalFeatures()}>Propose Additional Features</button>
          </form>

          <h2>Advanced Options</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Feature Type:
              <select value={featureType} onChange={(e) => setFeatureType(e.target.value)}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </label>
            <br />
            <button onClick={() => proposeAdditionalFeatures(featureType)}>Propose Additional Features</button>
          </form>
        </div>
      );
    }

    const proposeAdditionalFeatures = async (type = 'medium') => {
      try {
        const response = await axios.post(apiAddress, {
          type
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
        console.log(response.data);
        alert('Additional features proposed successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to propose additional features.');
      }
    };

    export default App;
