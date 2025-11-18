import axios from 'axios';
const API = process.env.REACT_APP_API_BASE + '/evaluations';

export const getEventForm = (eventId) => axios.get(`${API}/event/form/${eventId}`);
export const submitEventEvaluation = (data) => axios.post(`${API}/event/submit`, data);

export const getSpeakerForm = (speakerId) => axios.get(`${API}/speaker/form/${speakerId}`);
export const submitSpeakerEvaluation = (data) => axios.post(`${API}/speaker/submit`, data);

export const getEventAnalytics = (eventId) => axios.get(`${API}/analytics/event/${eventId}`);
export const getSpeakerAnalytics = (speakerId) => axios.get(`${API}/analytics/speaker/${speakerId}`);
