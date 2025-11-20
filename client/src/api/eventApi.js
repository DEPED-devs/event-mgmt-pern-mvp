import axios from 'axios';
const API = import.meta.env.VITE_API_BASE + "/events";//change react to vite


export const getEvents = () => axios.get(API);
export const getEvent = (id) => axios.get(`${API}/${id}`);
export const createEvent = (data) => axios.post(API, data);
