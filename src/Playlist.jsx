import Spotify from "./Spotify"; // Adjust the path if needed

function SaveButton({ onClick, playlistName, trackUris }) {
  const handleSave = async () => {
    await Spotify.savePlaylist(playlistName, trackUris);
    alert("Playlist saved to your Spotify account!");
    if (onClick) onClick(); // Call parent handler after saving
  };

  return (
    <button onClick={handleSave} disabled={trackUris.length === 0}>
      Save to Spotify
    </button>
  );
}

export default SaveButton;
