import fetch from "node-fetch";

exports.handler = async function () {
  const clientId = Netlify.env.get("SPOTIFY_CLIENT_ID");
  const clientSecret = Netlify.env.get("SPOTIFY_CLIENT_SECRET");
  const refreshToken = Netlify.env.get("SPOTIFY_REFRESH_TOKEN");

  // Refresh access token
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Call Spotify API (e.g., currently playing)
  const spotifyRes = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await spotifyRes.json();

  console.log(process.env.SPOTIFY_CLIENT_ID);
  console.log(data);
  return {
    statusCode: 200,
    body: JSON.stringify({ test: "test" }),
  };
};
