// utils/spotify.js
const clientID = 'fb31251099ec4a96a54f36d223ceb448';
const clientSecret = 'b364349647334f70a1aeab6544eeb313';

export async function fetchSpotifyAccessToken(code, host) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: host,
    }),
  });


  const data = await response.json();

  console.log(data)

  return data;
}


export async function refreshToken(refreshToken) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });


  const data = await response.json();

  console.log(('Authorization' + 'Basic ' + btoa(clientID + ':' + clientSecret)))

  console.log("Refresh token data", JSON.stringify(data))
  return data;
}
