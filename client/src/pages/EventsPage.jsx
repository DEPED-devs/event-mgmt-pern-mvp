import React, { useEffect, useState } from 'react';
import { getEvents } from '../api/eventApi';
import { Link } from 'react-router-dom';

export default function EventsPage(){
  const [events, setEvents] = useState([]);
  useEffect(()=>{ getEvents().then(r=>setEvents(r.data)).catch(()=>{}); },[]);

  return (
    <div>
      <h2>Events</h2>
      {events.map(ev=>(
        <div key={ev.id} className="card">
          <h3>{ev.title}</h3>
          <p>{ev.date} — {ev.venue}</p>
          <Link to={`/events/${ev.id}`} className="button">View</Link>
        </div>
      ))}
      {events.length===0 && <p>No events yet.</p>}
    </div>
  );
}
