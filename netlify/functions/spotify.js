const fetch = require("node-fetch");

const SPOTIFY_CLIENT_ID = Netlify.env.get("SPOTIFY_CLIENT_ID");
const SPOTIFY_CLIENT_SECRET = Netlify.env.get("SPOTIFY_CLIENT_SECRET");
const SPOTIFY_REFRESH_TOKEN = Netlify.env.get("SPOTIFY_REFRESH_TOKEN");
const basic = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString("base64");

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const data = await res.json();
  return data.access_token;
}

async function getTopTrack(accessToken) {
  const res = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=1&time_range=medium_term",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status}`);
  }

  const data = await res.json();
  const topTrack = data.items?.[0];

  return {
    title: topTrack?.name,
    artist: topTrack?.artists?.map((artist) => artist.name).join(", "),
    album: topTrack?.album?.name,
    albumImageUrl: topTrack?.album?.images?.[0]?.url,
    songUrl: topTrack?.external_urls?.spotify,
  };
}

exports.handler = async function () {
  try {
    const accessToken = await getAccessToken();
    const topTrack = await getTopTrack(accessToken);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topTrack),
    };
  } catch (err) {
    console.error("Spotify fetch error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch top track",
        details: err.message,
      }),
    };
  }
};
