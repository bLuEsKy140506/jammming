import React, { useState } from "react";
import "./App.css";
import Spotify from "./Spotify"; // adjust the path if needed
import SaveButton from "./Playlist";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [myPlaylistName, setMyPlaylistName] = useState("");

  const handleSearch = async () => {
    const tracks = await Spotify.search(searchTerm);
    setResults(tracks);
  };

  const addItem = (track) => {
    const newTrack = results.filter((result) => result.id !== track.id);
    setResults(newTrack);
    setMyPlaylist([...myPlaylist, track]);
  };

  const deleteItem = (listItem) => {
    const newTrack = myPlaylist.filter((list) => list.id !== listItem.id);
    setMyPlaylist(newTrack);
    setResults([...results, listItem]);
  };

  return (
    <>
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
      <div className="display-container">
        <ul className="results-list">
          <h2>Results</h2>
          {results.map((track) => (
            <li key={track.id} className="track-item">
              <div>
                {track.name} by {track.artist}
              </div>
              <button onClick={() => addItem(track)}>+</button>
            </li>
          ))}
        </ul>
        <ul className="results-list">
          <h2>My Playlist</h2>
          <input
            type="text"
            placeholder="name your playlist"
            value={myPlaylistName}
            onChange={(e) => setMyPlaylistName(e.target.value)}
            className="search-input"
          />
          {myPlaylist.map((list) => (
            <li key={list.id} className="track-item">
              <div>
                {list.name} by {list.artist}
              </div>
              <button onClick={() => deleteItem(list)}>-</button>
            </li>
          ))}
          <SaveButton
            onClick={() => {
              setMyPlaylist([]);
              setMyPlaylistName("");
            }} // Clear playlist after saving
            playlistName={myPlaylistName}
            trackUris={myPlaylist.map((track) => track.uri)}
          />
        </ul>
      </div>
    </>
  );
}

export default App;
