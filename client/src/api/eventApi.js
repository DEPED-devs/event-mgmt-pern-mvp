import axios from 'axios';
const API = process.env.REACT_APP_API_BASE + '/events';

export const getEvents = () => axios.get(API);
export const getEvent = (id) => axios.get(`${API}/${id}`);
export const createEvent = (data) => axios.post(API, data);
