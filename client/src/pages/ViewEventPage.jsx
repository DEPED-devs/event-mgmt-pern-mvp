import React, { useEffect, useState } from 'react';
import { getEvent } from '../api/eventApi';
import { useParams, Link } from 'react-router-dom';

export default function ViewEventPage(){
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  useEffect(()=>{ getEvent(id).then(r=>setEvent(r.data)).catch(()=>{}); },[id]);

  if(!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {event.date} <strong>Venue:</strong> {event.venue}</p>
      <Link to={`/events/${id}/evaluate`} className="button">Evaluate</Link>
    </div>
  );
}
