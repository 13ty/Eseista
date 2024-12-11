import React, { useState } from 'react';
    import axios from 'axios';

    function App() {
      const [genre, setGenre] = useState('');
      // Add other state variables for length, mood, audience, theme

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:7860/api/generate', {
            genre,
            // Include other selected variables
          });
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      return (
        <div>
          {/* Add form inputs for genre, length, mood, audience, theme */}
          <button onClick={handleSubmit}>Generate Essay</button>
        </div>
      );
    }

    export default App;
