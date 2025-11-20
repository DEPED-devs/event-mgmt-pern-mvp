import axios from 'axios';
const API = import.meta.env.VITE_API_BASE + "/speakers";//change react to vite

export const getSpeakers = (eventId) => axios.get(`${API}/event/${eventId}`);
export const addSpeaker = (data) => axios.post(API, data);
