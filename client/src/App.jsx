import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import ViewEventPage from './pages/ViewEventPage';
import EvaluationHub from './components/EvaluationHub';
import EventEvalForm from './pages/EventEvalForm';
import SpeakerEvalForm from './pages/SpeakerEvalForm';

function App() {
  return (
    <div className="app">
      <header>
        <h1><Link to="/">Event Mgmt</Link></h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<EventsPage/>} />
          <Route path="/events/:id" element={<ViewEventPage/>} />
          <Route path="/events/:eventId/evaluate" element={<EvaluationHub/>} />
          <Route path="/events/:eventId/evaluate/event" element={<EventEvalForm/>} />
          <Route path="/events/:eventId/speakers/:speakerId/evaluate" element={<SpeakerEvalForm/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App
