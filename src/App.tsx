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
    PopulationsPanel,
    ColonyPanel,
    TechnologyPanel,
    InfoPopup,
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
        <PopulationsPanel />
        <ColonyPanel />
        <TechnologyPanel />
        <EventsPanel />

        <InfoPopup />
    </div>
  );
}

export default App;
