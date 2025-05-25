import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/code'; // Change to your backend URL

// ✅ Save Code
export const saveCode = async (roomId, username, code) => {
  try {
    await axios.post(`${API_BASE_URL}/save`, { roomId, username, code });
  } catch (error) {
    console.error('Error saving code:', error);
  }
};

// ✅ Fetch Code
export const fetchCode = async (roomId, username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${roomId}/${username}`);
    return response.data.code || '';
  } catch (error) {
    console.error('Error fetching saved code:', error);
    return '';
  }
};
