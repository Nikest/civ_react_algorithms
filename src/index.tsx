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
// 43144
// 42124
// 74232

const civSeed = 7422156 // Math.floor(Math.random() * 100000);
// civ seeds
// 43144
// 4004

const game = new Game(systemSeed, civSeed);
window.game = game;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
