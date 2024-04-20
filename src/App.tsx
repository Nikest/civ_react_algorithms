import React from 'react';
import './App.css';

import {
    SystemPanel,
    System3DView,
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
        <System3DView />
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
