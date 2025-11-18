import React, { useEffect, useState } from 'react';
import { getSpeakers } from '../api/speakerApi';
import { Link, useParams } from 'react-router-dom';

export default function EvaluationHub(){
  const { eventId } = useParams();
  const [speakers, setSpeakers] = useState([]);
  useEffect(()=>{ getSpeakers(eventId).then(r=>setSpeakers(r.data)).catch(()=>{}); },[eventId]);

  return (
    <div>
      <h2>Evaluation Center</h2>
      <div className="card">
        <Link to={`/events/${eventId}/evaluate/event`} className="button">Evaluate This Event</Link>
      </div>

      <h3>Evaluate a Speaker</h3>
      <div>
        {speakers.map(s=>(
          <Link key={s.id} to={`/events/${eventId}/speakers/${s.id}/evaluate`} className="speaker-card">
            <strong>{s.name}</strong><div><small>{s.topic}</small></div>
          </Link>
        ))}
        {speakers.length===0 && <p className="card">No speakers listed.</p>}
      </div>
    </div>
  );
}
