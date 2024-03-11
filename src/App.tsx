import React from 'react';
import './App.css';

import {
    SystemPanel,
    CivilizationPanel,
    PersonsPanel,
    ColonialFleet,
    TimerPanel,
    EventsPanel,
    PlanetViewPanel,
} from "./sections";

function App() {
  return (
    <div className="App">
        <TimerPanel />
        <SystemPanel />
        <PlanetViewPanel />
        <CivilizationPanel />
        <PersonsPanel />
        <ColonialFleet />

        <EventsPanel />
    </div>
  );
}

export default App;
