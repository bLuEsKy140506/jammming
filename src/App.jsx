import React, { useState } from 'react';
import './App.css';
import Spotify from './Spotify'; // adjust the path if needed

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const tracks = await Spotify.search(searchTerm);
    setResults(tracks);
  };

  return (
    <div>
      <h1>Spotify Search Test</h1>
      <input
        type="text"
        placeholder="Search songs"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map(track => (
          <li key={track.id}>
            {track.name} by {track.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
