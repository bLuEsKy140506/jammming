const clientId = 'd37481774e744789a6c92db53dc9d4b8';
// const redirectUri = 'http://127.0.0.1:5173/callback'; // Your app’s redirect URI
const redirectUri = 'https://jammming-ruby.vercel.app/'; // NEW


const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private'
];
const authEndpoint = 'https://accounts.spotify.com/authorize';

let accessToken;

// Generate a random string
const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

// Base64 URL encode
const base64URLEncode = (str) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// SHA-256 encode
const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
};

const Spotify = {
  async getAccessToken() {
    if (accessToken) return accessToken;

const storedToken = localStorage.getItem('spotify_token');
const expiration = localStorage.getItem('spotify_token_expiration');

if (storedToken && expiration && new Date().getTime() < Number(expiration)) {
  return storedToken;
}

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (!code) {
      const codeVerifier = generateRandomString(128);
      const codeChallenge = base64URLEncode(await sha256(codeVerifier));

      localStorage.setItem('code_verifier', codeVerifier);

      const authUrl = `${authEndpoint}?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
        scopes.join(' ')
      )}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

      window.location = authUrl;
    } else {
      const codeVerifier = localStorage.getItem('code_verifier');

      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          code_verifier: codeVerifier,
        }),
      });

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;
      localStorage.setItem('spotify_token', accessToken);

      const expiresIn = tokenData.expires_in; // usually 3600 seconds
const expirationTime = new Date().getTime() + expiresIn * 1000;

localStorage.setItem('spotify_token_expiration', expirationTime);

      window.history.replaceState({}, document.title, '/'); // Clean up URL

      return accessToken;
    }
  },

  async search(term) {
    const token = await this.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const jsonResponse = await response.json();
    if (!jsonResponse.tracks) return [];
    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

   async savePlaylist(name, trackUris) {
  try {
    if (!name || !trackUris.length) return;

    const token = await Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Get user ID
    const response = await fetch('https://api.spotify.com/v1/me', { headers });
    const jsonResponse = await response.json();
    const userId = jsonResponse.id;

    if (!userId) {
      console.error('No user ID found', jsonResponse);
      return;
    }

    // Create playlist
    const createPlaylist = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ name }),
      }
    );

    if (!createPlaylist.ok) {
      const error = await createPlaylist.text();
      console.error('Failed to create playlist:', error);
      return;
    }

    const playlistResponse = await createPlaylist.json();
    const playlistId = playlistResponse.id;

    if (!playlistId) {
      console.error('No playlist ID returned:', playlistResponse);
      return;
    }

    // Add tracks
    const addTracks = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ uris: trackUris }),
      }
    );

    if (!addTracks.ok) {
      const error = await addTracks.text();
      console.error('Failed to add tracks:', error);
    }

  } catch (error) {
    console.error('Error saving playlist:', error);
  }
}



  
};

export default Spotify;
