
    import React, { useState, useRef } from 'react';
    import { saveAs } from 'file-saver';
    import { 
      FaFilePdf, 
      FaFileWord, 
      FaFileCode, 
      FaFileExport, 
      FaCopy 
    } from 'react-icons/fa';
    import jsPDF from 'jspdf';
    import * as htmlDocx from 'html-docx-js';

    const AIResponseManager = ({ 
      response, 
      metadata = {}, 
      onContinue, 
      onRefine 
    }) => {
      const [activeView, setActiveView] = useState('raw');
      const responseRef = useRef(null);

      // Export formats
      const exportFormats = [
        {
          name: 'PDF',
          icon: <FaFilePdf />,
          handler: exportToPDF
        },
        {
          name: 'DOCX',
          icon: <FaFileWord />,
          handler: exportToDocx
        },
        {
          name: 'JSON',
          icon: <FaFileCode />,
          handler: exportToJson
        },
        {
          name: 'Plain Text',
          icon: <FaFileExport />,
          handler: exportToTxt
        }
      ];

      // PDF Export
      function exportToPDF() {
        const doc = new jsPDF();
        doc.setFontSize(10);
        
        // Add metadata
        doc.text(`Title: ${metadata.title || 'AI Generated Content'}`, 10, 10);
        doc.text(`Generated at: ${new Date().toLocaleString()}`, 10, 20);
        
        // Add content
        doc.text(response, 10, 30, { maxWidth: 180 });
        
        doc.save('ai_response.pdf');
      }

      // DOCX Export
      function exportToDocx() {
        const htmlContent = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .metadata { color: #666; margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <div class="metadata">
                <p><strong>Title:</strong> ${metadata.title || 'AI Generated Content'}</p>
                <p><strong>Generated at:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <div class="content">
                ${response.replace(/\n/g, '<br/>')}
              </div>
            </body>
          </html>
        `;

        const converted = htmlDocx.asBlob(htmlContent);
        saveAs(converted, 'ai_response.docx');
      }

      // JSON Export
      function exportToJson() {
        const exportData = {
          content: response,
          metadata: metadata,
          generatedAt: new Date().toISOString()
        };

        const blob = new Blob(
          [JSON.stringify(exportData, null, 2)], 
          { type: 'application/json' }
        );
        saveAs(blob, 'ai_response.json');
      }

      // Plain Text Export
      function exportToTxt() {
        const blob = new Blob(
          [`${metadata.title || 'AI Generated Content'}\n\n${response}`], 
          { type: 'text/plain;charset=utf-8' }
        );
        saveAs(blob, 'ai_response.txt');
      }

      // Copy to Clipboard
      const copyToClipboard = () => {
        navigator.clipboard.writeText(response)
          .then(() => alert('Copied to clipboard!'))
          .catch(err => console.error('Copy failed', err));
      };

      // View Modes
      const viewModes = [
        { name: 'Raw', value: 'raw' },
        { name: 'Formatted', value: 'formatted' },
        { name: 'Markdown', value: 'markdown' }
      ];

      return (
        <div className="ai-response-container">
          <div className="response-header">
            <div className="view-modes">
              {viewModes.map(mode => (
                <button 
                  key={mode.value}
                  className={activeView === mode.value ? 'active' : ''}
                  onClick={() => setActiveView(mode.value)}
                >
                  {mode.name}
                </button>
              ))}
            </div>

            <div className="response-actions">
              <button 
                onClick={copyToClipboard}
                title="Copy to Clipboard"
              >
                <FaCopy /> Copy
              </button>
            </div>
          </div>

          <div 
            ref={responseRef} 
            className={`response-content ${activeView}`}
          >
            {response}
          </div>

          <div className="export-section">
            <h3>Export Options</h3>
            <div className="export-buttons">
              {exportFormats.map(format => (
                <button 
                  key={format.name} 
                  onClick={format.handler}
                >
                  {format.icon} {format.name}
                </button>
              ))}
            </div>
          </div>

          <div className="continuation-actions">
            <button onClick={onContinue}>Continue This Idea</button>
            <button onClick={onRefine}>Refine Response</button>
          </div>
        </div>
      );
    };

    export default AIResponseManager;
  </boltAction