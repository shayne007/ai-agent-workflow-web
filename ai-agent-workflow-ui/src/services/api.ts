import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // TODO: Update with actual backend URL
  timeout: 5000,
});

export const fetchWorkflows = async () => {
  try {
    const response = await api.get('/workflows');
    return response.data;
  } catch (error) {
    console.error('Error fetching workflows:', error);
    throw error;
  }
};

export const saveWorkflow = async (workflow: any) => {
  try {
    const response = await api.post('/workflows', workflow);
    return response.data;
  } catch (error) {
    console.error('Error saving workflow:', error);
    throw error;
  }
};

export const executeWorkflow = async (workflowId: string) => {
  try {
    const response = await api.post(`/workflows/${workflowId}/execute`);
    return response.data;
  } catch (error) {
    console.error('Error executing workflow:', error);
    throw error;
  }
};

export const getExecutionStatus = async (executionId: string) => {
  try {
    const response = await api.get(`/executions/${executionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching execution status:', error);
    throw error;
  }
};