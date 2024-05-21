import React from 'react';
import './App.css';

import {
    System3DView,
    CivilizationPanel,
    PersonsPanel,
    ColonialFleet,
    TimerPanel,
    EventsPanel,
    Planet3DPanel,
} from "./sections";

function App() {
  return (
    <div className="App">
        <TimerPanel />
        <System3DView />
        <Planet3DPanel />
        <CivilizationPanel />
        <PersonsPanel />
        <ColonialFleet />

        <EventsPanel />
    </div>
  );
}

export default App;
