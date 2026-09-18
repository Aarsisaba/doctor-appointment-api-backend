const axios = require("axios");

// ==========================================
// Geocoding — converts a hospital/clinic address into [longitude, latitude].
//
// TWO PROVIDERS SUPPORTED:
//   1. OpenStreetMap Nominatim (FREE, no API key, no billing/card needed)
//      -> used automatically whenever GOOGLE_MAPS_API_KEY is missing or
//         still set to the placeholder value.
//   2. Google Maps Geocoding API (paid tier, needs billing + a real key)
//      -> used automatically the moment a real GOOGLE_MAPS_API_KEY is set
//         in .env — no code change required to switch.
//
// Both return the exact same shape, so the rest of the app never needs to
// know which provider actually served the request.
// ==========================================

const isGoogleKeyConfigured = () => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  return !!key && key !== "your_google_maps_api_key_here";
};

// -------- Provider 1: OpenStreetMap Nominatim (FREE) --------
const geocodeWithOSM = async (fullAddress) => {
  const url = "https://nominatim.openstreetmap.org/search";

  const response = await axios.get(url, {
    params: {
      q: fullAddress,
      format: "json",
      limit: 1,
    },
    headers: {
      // Nominatim's usage policy requires a descriptive User-Agent
      "User-Agent": "doctor-appointment-api/1.0 (contact: admin@example.com)",
    },
  });

  const results = response.data;

  console.log("OSM GEOCODE DEBUG:", results.length ? "FOUND" : "ZERO_RESULTS");

  if (!results || results.length === 0) {
    throw new Error(
      "Could not find location for the given hospital/clinic address (OpenStreetMap found no match). Try a simpler/more standard address."
    );
  }

  const { lat, lon } = results[0];

  return {
    type: "Point",
    coordinates: [parseFloat(lon), parseFloat(lat)], // GeoJSON order: [longitude, latitude]
  };
};

// -------- Provider 2: Google Maps Geocoding API --------
const geocodeWithGoogle = async (fullAddress) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = "https://maps.googleapis.com/maps/api/geocode/json";

  const response = await axios.get(url, {
    params: {
      address: fullAddress,
      key: apiKey,
    },
  });

  const { status, results, error_message } = response.data;

  console.log("GOOGLE GEOCODE DEBUG:", status, error_message || "");

  if (status !== "OK" || !results || results.length === 0) {
    throw new Error(
      `Could not find location for the given hospital/clinic address (Google status: ${status}${
        error_message ? " - " + error_message : ""
      })`
    );
  }

  const { lat, lng } = results[0].geometry.location;

  return {
    type: "Point",
    coordinates: [lng, lat],
  };
};

// -------- Entry point used by the rest of the app --------
const geocodeAddress = async (hospitalName, visitedAddress) => {
  const fullAddress = `${hospitalName}, ${visitedAddress}`;

  if (isGoogleKeyConfigured()) {
    return await geocodeWithGoogle(fullAddress);
  }

  // No real Google key configured -> use the free OpenStreetMap provider
  return await geocodeWithOSM(fullAddress);
};

module.exports = {
  geocodeAddress,
};
