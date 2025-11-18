import React, { useEffect, useState } from 'react';
import { getSpeakerForm, submitSpeakerEvaluation } from '../api/evaluationApi';
import { useParams, useNavigate } from 'react-router-dom';

export default function SpeakerEvalForm(){
  const { speakerId } = useParams();
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
  const nav = useNavigate();

  useEffect(()=>{ getSpeakerForm(speakerId).then(r=>setFormData(r.data)).catch(()=>{}); },[speakerId]);

  const setAns = (qid, val) => setAnswers(prev=>({ ...prev, [qid]: val }));

  const handleSubmit = async () => {
    const payload = {
      speaker_id: +speakerId,
      attendee_id: null,
      answers: Object.keys(answers).map(k=>({ question_id: +k, answer: answers[k] }))
    };
    await submitSpeakerEvaluation(payload);
    nav('/');
  };

  if(!formData) return <p>Loading...</p>;

  return (
    <div className="form-page">
      <h2>Evaluate {formData.speaker.name}</h2>
      <p><em>{formData.speaker.topic}</em></p>
      {formData.questions.map(q=>(
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
