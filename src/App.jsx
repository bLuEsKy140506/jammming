import React, { useState } from "react";
import "./App.css";
import Spotify from "./Spotify"; // adjust the path if needed

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const tracks = await Spotify.search(searchTerm);
    setResults(tracks);
    console.log(results);
  };

  return (
    <div>
      <h1 className="app-title">
        Ja<span className="trademark">mmm</span>ing
      </h1>
      <br />
      <input
        type="text"
        placeholder="Search artist or track"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <button onClick={handleSearch}>Search</button>
      <br />
      <br />
      <ul className="results-list">
        <h2>Results</h2>
        {results.map((track) => (
          <li key={track.id} className="track-item">
            <div>
              {track.name} by {track.artist}
            </div>
            <button>+</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
