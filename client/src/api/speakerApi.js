import axios from 'axios';
const API = process.env.REACT_APP_API_BASE + '/speakers';

export const getSpeakers = (eventId) => axios.get(`${API}/event/${eventId}`);
export const addSpeaker = (data) => axios.post(API, data);
