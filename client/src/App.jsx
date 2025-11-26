import { Routes, Route } from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import ViewEventPage from "./pages/ViewEventPage";
import EventEvalForm from "./pages/EventEvalForm";
import SpeakerEvalForm from "./pages/SpeakerEvalForm";
import EvaluationHub from "./components/EvaluationHub";
import RegistrationPage from "./pages/RegistrationPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<ViewEventPage />} />
        <Route path="/events/:eventId/evaluate" element={<EvaluationHub />} />
        <Route
          path="/events/:eventId/evaluate/event"
          element={<EventEvalForm />}
        />
        <Route
          path="/events/:eventId/speakers/:speakerId/evaluate"
          element={<SpeakerEvalForm />}
        />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </div>
  );
}

export default App;
