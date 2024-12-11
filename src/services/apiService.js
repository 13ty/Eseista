import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:11434';

export const generateEssay = async (params) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/generate`, {
      model: 'llama2',
      prompt: `Generate an ${params.length} ${params.genre} essay about ${params.theme}. 
               Provide a structured essay with clear introduction, body paragraphs, and conclusion.`,
      stream: false
    });
    
    return response.data;
  } catch (error) {
    console.error('Essay Generation Error:', error);
    throw new Error('Failed to generate essay. Please try again.');
  }
};

export const continueEssay = async (previousText) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/generate`, {
      model: 'llama2',
      prompt: `Continue the following essay, maintaining its style and tone:\n\n${previousText}\n\nContinue from where the previous text left off.`,
      stream: false
    });
    
    return response.data;
  } catch (error) {
    console.error('Essay Continuation Error:', error);
    throw new Error('Failed to continue essay. Please try again.');
  }
};
