import api from './api';

export interface ChatMessage {
  text: string;
  type?: 'query' | 'feedback' | 'loan';
}

export interface ChatResponse {
  text: string;
  actions?: Array<{
    type: string;
    payload: any;
  }>;
}

export const sendMessage = async (text: string, type: 'query' | 'feedback' | 'loan' = 'query'): Promise<ChatResponse> => {
  try {
    const response = await api.post('/chat', { text, type });
    return response.data;
  } catch (error) {
    console.error('Error in chat service:', error);
    throw error;
  }
};

export const startLoanRequest = async (initialData: any): Promise<ChatResponse> => {
  try {
    const response = await api.post('/workflow/loan/start', initialData);
    return response.data;
  } catch (error) {
    console.error('Error starting loan workflow:', error);
    throw error;
  }
};