import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Game } from './game/Game';
import { Star } from './game/system/star/Star';

declare global {
    interface Window {
        game: Game;
    }
}

const systemSeed = Math.floor(Math.random() * 100000);
// system seeds
// 11800
// 82767
// 75490
// 35052
// 63613
// 16379
// 40222

const civSeed = Math.floor(Math.random() * 100000);
// civ seeds
// 43144
// 4004

const game = new Game(17588, 48742);
window.game = game;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
