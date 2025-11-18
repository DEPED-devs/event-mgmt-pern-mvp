import React, { useEffect, useState } from 'react';
import { getEventForm, submitEventEvaluation } from '../api/evaluationApi';
import { useParams, useNavigate } from 'react-router-dom';

export default function EventEvalForm(){
  const { eventId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const nav = useNavigate();

  useEffect(()=>{ getEventForm(eventId).then(r=>setForm(r.data)).catch(()=>{}); },[eventId]);

  const setAns = (qid, val) => setAnswers(prev=>({ ...prev, [qid]: val }));

  const handleSubmit = async () => {
    const payload = {
      event_id: +eventId,
      attendee_id: null,
      answers: Object.keys(answers).map(k=>({ question_id: +k, answer: answers[k] }))
    };
    await submitEventEvaluation(payload);
    nav('/');
  };

  if(!form) return <p>Loading...</p>;

  return (
    <div className="form-page">
      <h2>{form.form.title || 'Event Evaluation'}</h2>
      {form.questions.map(q=>(
        <div key={q.id} className="question">
          <label>{q.question_text}</label>
          {q.question_type === 'rating' ? (
            <select onChange={e=>setAns(q.id, e.target.value)}>
              <option value="">Select</option>
              {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
          ) : (
            <textarea onChange={e=>setAns(q.id, e.target.value)} />
          )}
        </div>
      ))}
      <button className="button" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
