import { useEffect, useState } from "react";
import "./App.css";

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: "include",
  });
  const responseText = await response.text();
  let data;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    throw new Error(
      "The server returned an invalid response. Check that the backend is running."
    );
  }

  if (!response.ok) {
    const error = new Error(data?.message || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }

  if (!data) {
    throw new Error("The server returned an empty response.");
  }

  return data;
}

const destinations = [
  {
    id: "coorg",
    name: "Coorg",
    subtitle: "The Scotland of India",
    image:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
    description:
      "Explore misty hills, coffee plantations, waterfalls, and peaceful landscapes.",
    places: [
      {
        name: "Abbey Falls",
        day: 1,
        time: "Morning",
        tags: ["nature", "adventure"],
        description:
          "A beautiful waterfall surrounded by lush greenery and coffee plantations.",
        tip: "Wear comfortable walking shoes and follow the marked paths.",
      },
      {
        name: "Raja's Seat",
        day: 1,
        time: "Evening",
        tags: ["nature", "photography"],
        description:
          "A popular viewpoint known for its valley views and sunset scenery.",
        tip: "Visit in the evening for the best chance of enjoying the sunset.",
      },
      {
        name: "Dubare Elephant Camp",
        day: 2,
        time: "Morning",
        tags: ["nature", "adventure", "wildlife"],
        description:
          "A riverside destination associated with elephant-related activities and wildlife experiences.",
        tip: "Check activity availability and timings before visiting.",
      },
      {
        name: "Golden Temple, Bylakuppe",
        day: 2,
        time: "Afternoon",
        tags: ["temples", "culture", "history"],
        description:
          "A Tibetan Buddhist monastery complex known for its colourful architecture.",
        tip: "Dress respectfully and follow the monastery's visitor guidelines.",
      },
      {
        name: "Talacauvery",
        day: 3,
        time: "Morning",
        tags: ["nature", "temples", "culture"],
        description:
          "A sacred site in the Brahmagiri hills associated with the origin of the River Cauvery.",
        tip: "Allow time for the hill drive and check local weather conditions.",
      },
      {
        name: "Madikeri Fort",
        day: 3,
        time: "Afternoon",
        tags: ["history", "culture", "photography"],
        description:
          "A historic fort in Madikeri reflecting the region's past.",
        tip: "Check current opening hours before planning your visit.",
      },
    ],
  },
  {
    id: "mysuru",
    name: "Mysuru",
    subtitle: "The City of Palaces",
    image:
      "https://images.unsplash.com/photo-1600112356915-089abb8fc71a?auto=format&fit=crop&w=1000&q=80",
    description:
      "Discover royal architecture, historic markets, temples, and cultural heritage.",
    places: [
      {
        name: "Mysuru Palace",
        day: 1,
        time: "Morning",
        tags: ["history", "culture", "photography"],
        description:
          "The city's iconic royal palace, famous for its Indo-Saracenic architecture.",
        tip: "Check ticket details and photography restrictions before entering.",
      },
      {
        name: "Devaraja Market",
        day: 1,
        time: "Afternoon",
        tags: ["food", "culture", "shopping"],
        description:
          "A historic market filled with flowers, produce, spices, and local activity.",
        tip: "Try exploring the market on foot and ask before photographing vendors.",
      },
      {
        name: "Chamundi Hills",
        day: 2,
        time: "Morning",
        tags: ["temples", "culture", "nature"],
        description:
          "A hilltop destination associated with Chamundeshwari Temple and views over Mysuru.",
        tip: "Plan for traffic and stairs if you intend to climb.",
      },
      {
        name: "St. Philomena's Church",
        day: 2,
        time: "Afternoon",
        tags: ["history", "culture", "architecture"],
        description:
          "A prominent neo-Gothic church known for its tall spires and stained-glass windows.",
        tip: "Visit respectfully during services and follow posted visitor rules.",
      },
      {
        name: "Brindavan Gardens",
        day: 2,
        time: "Evening",
        tags: ["nature", "photography", "family"],
        description:
          "Landscaped gardens near the Krishna Raja Sagara Dam.",
        tip: "Confirm garden and fountain-show timings before travelling.",
      },
    ],
  },
  {
    id: "hampi",
    name: "Hampi",
    subtitle: "A Journey into History",
    image:
      "https://images.unsplash.com/photo-1600100397608-f010e6b3f9b9?auto=format&fit=crop&w=1000&q=80",
    description:
      "Explore the remarkable ruins, temples, stone architecture, and landscapes of the Vijayanagara Empire.",
    places: [
      {
        name: "Virupaksha Temple",
        day: 1,
        time: "Morning",
        tags: ["temples", "history", "culture"],
        description:
          "A historic temple that remains an important religious site in Hampi.",
        tip: "Follow temple rules and check local photography restrictions.",
      },
      {
        name: "Hampi Bazaar",
        day: 1,
        time: "Afternoon",
        tags: ["history", "culture", "shopping"],
        description:
          "A historic street associated with the former Vijayanagara settlement.",
        tip: "Explore on foot and carry drinking water in hot weather.",
      },
      {
        name: "Vijaya Vittala Temple",
        day: 2,
        time: "Morning",
        tags: ["temples", "history", "architecture"],
        description:
          "A celebrated temple complex known for intricate stonework and the Stone Chariot.",
        tip: "Allow enough time to explore the large monument complex.",
      },
      {
        name: "Stone Chariot",
        day: 2,
        time: "Afternoon",
        tags: ["history", "architecture", "photography"],
        description:
          "An iconic stone monument within the Vittala Temple complex.",
        tip: "Follow monument protection rules; do not climb on protected structures.",
      },
      {
        name: "Hemakuta Hill",
        day: 3,
        time: "Morning",
        tags: ["nature", "history", "photography"],
        description:
          "A rocky hill dotted with historic temples and wide views of Hampi.",
        tip: "Start early to avoid the strongest midday heat.",
      },
    ],
  },
  {
    id: "chikmagalur",
    name: "Chikmagalur",
    subtitle: "Mountains, Coffee & Calm",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=80",
    description:
      "Enjoy mountain scenery, coffee estates, lakes, and nature trails.",
    places: [
      {
        name: "Mullayanagiri",
        day: 1,
        time: "Morning",
        tags: ["nature", "adventure", "photography"],
        description:
          "A mountain destination popular for its panoramic views and cool weather.",
        tip: "Check weather and road conditions before travelling uphill.",
      },
      {
        name: "Baba Budangiri",
        day: 1,
        time: "Afternoon",
        tags: ["nature", "history", "culture"],
        description:
          "A mountain range with natural scenery and religious significance.",
        tip: "Respect local customs at religious sites.",
      },
      {
        name: "Jhari Falls",
        day: 2,
        time: "Morning",
        tags: ["nature", "adventure"],
        description:
          "A waterfall surrounded by greenery near the coffee-growing region.",
        tip: "Access conditions can vary; check local transport arrangements.",
      },
      {
        name: "Coffee Plantation",
        day: 2,
        time: "Afternoon",
        tags: ["nature", "food", "culture"],
        description:
          "Discover the region's coffee-growing traditions and plantation landscapes.",
        tip: "Arrange a visit with a plantation that welcomes guests.",
      },
      {
        name: "Hirekolale Lake",
        day: 2,
        time: "Evening",
        tags: ["nature", "photography", "family"],
        description:
          "A scenic lake surrounded by hills, popular for peaceful views.",
        tip: "Check the weather and leave before it gets too dark.",
      },
    ],
  },
];

const interestOptions = [
  { value: "nature", label: "Nature & waterfalls" },
  { value: "history", label: "History & heritage" },
  { value: "temples", label: "Temples & spirituality" },
  { value: "food", label: "Food & local markets" },
  { value: "adventure", label: "Adventure" },
  { value: "culture", label: "Culture & traditions" },
  { value: "photography", label: "Photography" },
  { value: "wildlife", label: "Wildlife" },
  { value: "architecture", label: "Architecture" },
  { value: "family", label: "Family-friendly places" },
];

const cultureGuides = {
  coorg: {
    intro:
      "Kodagu is home to distinctive Kodava traditions, coffee estates, and a rich food culture.",
    dishes: [
      "Kodava pandi curry — a bold pork curry; ask about spice and ingredients.",
      "Kadambuttu — steamed rice dumplings often served with curry.",
      "Akki rotti — rice flatbread paired with chutney or curry.",
    ],
    traditions: [
      "Puthari celebrates the rice harvest in Kodava communities.",
      "Kailpodh and Kaveri Sankramana are important Kodagu observances.",
      "Festival dates and customs vary; ask local hosts before planning a visit.",
    ],
    etiquette: [
      "Ask permission before photographing people, homes, or ceremonies.",
      "Follow a host's guidance at family and community gatherings.",
      "Use marked paths and follow estate rules when visiting coffee farms.",
    ],
    specialties: [
      "Coffee, pepper, cardamom, and other locally grown produce.",
      "Look for clear origin information and buy directly from local growers where possible.",
    ],
  },
  mysuru: {
    intro:
      "Mysuru's royal heritage lives alongside its food, markets, arts, and everyday city life.",
    dishes: [
      "Mysore masala dosa — a crisp dosa with a spiced potato filling.",
      "Mysore pak — the city's well-known ghee and gram-flour sweet.",
      "Try a local tiffin or Karnataka-style meal at a busy neighbourhood eatery.",
    ],
    traditions: [
      "Mysuru Dasara is the city's best-known annual festival; dates follow the festival calendar.",
      "Mysuru has a long tradition of classical arts and Mysore-style painting.",
      "Check official announcements for current festival events and public access.",
    ],
    etiquette: [
      "At temples, follow posted dress, footwear, and photography rules.",
      "Ask before photographing market vendors or people at worship.",
      "At the palace and museums, follow ticket and photography instructions.",
    ],
    specialties: [
      "Mysore pak, Mysore silk, and Mysore-style paintings.",
      "Buy silk and sandalwood products from reputable or authorised sellers.",
    ],
  },
  hampi: {
    intro:
      "Hampi is both a protected heritage landscape and a living place of worship.",
    dishes: [
      "Jolada rotti — sorghum flatbread common in North Karnataka.",
      "Ennegayi — stuffed brinjal curry, often served with rotti.",
      "Shenga chutney — a peanut chutney; check for allergens before ordering.",
    ],
    traditions: [
      "Virupaksha Temple remains an active place of worship; visitors should respect ongoing ceremonies.",
      "Hampi Utsav celebrates the region's music, dance, and heritage when scheduled.",
      "Festival dates and monument access can change; confirm locally before travelling.",
    ],
    etiquette: [
      "Do not climb, carve, or sit on protected monuments; stay on marked routes.",
      "Dress respectfully and follow temple rules, including footwear guidance.",
      "Ask before photographing worshippers, performers, or local residents.",
    ],
    specialties: [
      "Look for locally made crafts, including Lambani embroidery in nearby markets.",
      "Ask sellers about the maker and origin; avoid buying anything removed from heritage sites.",
    ],
  },
  chikmagalur: {
    intro:
      "The Malnad region is known for coffee-growing landscapes, seasonal produce, and hearty home-style food.",
    dishes: [
      "Akki rotti — rice flatbread often served with a spicy side.",
      "Kadubu — steamed dumplings with regional variations.",
      "Freshly brewed local coffee; ask about the roast and preparation.",
    ],
    traditions: [
      "Coffee picking and processing follow seasonal cycles; estate visits need the owner's permission.",
      "Village and temple festivals follow local calendars and differ by community.",
      "Ask your host or local tourism office for current festival dates and visitor guidance.",
    ],
    etiquette: [
      "Get permission before entering an estate or photographing workers.",
      "Follow local guidance at religious sites and nature areas.",
      "Carry reusable water bottles and take litter back with you on trails.",
    ],
    specialties: [
      "Coffee, pepper, cardamom, and other Malnad-grown produce.",
      "Buy sealed, labelled products from local growers or trusted shops.",
    ],
  },
};

const kannadaPhrases = [
  { kannada: "ನಮಸ್ಕಾರ", phrase: "Namaskara", meaning: "Hello" },
  { kannada: "ದಯವಿಟ್ಟು", phrase: "Dayavittu", meaning: "Please" },
  { kannada: "ಧನ್ಯವಾದಗಳು", phrase: "Dhanyavadagalu", meaning: "Thank you" },
  { kannada: "ಇದು ಎಷ್ಟು?", phrase: "Idu eshtu?", meaning: "How much is this?" },
];

const destinationWeatherLocations = {
  Coorg: { latitude: 12.4244, longitude: 75.7382 },
  Mysuru: { latitude: 12.2958, longitude: 76.6394 },
  Hampi: { latitude: 15.335, longitude: 76.46 },
  Chikmagalur: { latitude: 13.3161, longitude: 75.772 },
};

const weatherDescriptions = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Heavy rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail",
};

function formatForecastDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

const emergencyFacilityGroups = [
  {
    id: "healthcare",
    label: "Hospitals & clinics",
    fallbackName: "Hospital or clinic",
    amenities: ["hospital", "clinic", "doctors"],
  },
  {
    id: "police",
    label: "Police stations",
    fallbackName: "Police station",
    amenities: ["police"],
  },
  {
    id: "pharmacy",
    label: "Pharmacies",
    fallbackName: "Pharmacy",
    amenities: ["pharmacy"],
  },
];

function getFacilityAddress(tags) {
  if (tags["addr:full"]) return tags["addr:full"];

  const street = [tags["addr:housenumber"], tags["addr:street"]]
    .filter(Boolean)
    .join(" ");
  const parts = [
    street,
    tags["addr:suburb"] || tags["addr:neighbourhood"] || tags["addr:place"],
    tags["addr:city"] || tags["addr:town"] || tags["addr:village"],
    tags["addr:state"],
    tags["addr:postcode"],
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : "Address not available in map data";
}

function getDistanceInKm(origin, destination) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDifference = radians(destination.lat - origin.lat);
  const longitudeDifference = radians(destination.lon - origin.lon);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(radians(origin.lat)) *
      Math.cos(radians(destination.lat)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function App() {
  const [showPlanner, setShowPlanner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");

  const [startingCity, setStartingCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");

  const [destination, setDestination] = useState("coorg");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("2");
  const [budget, setBudget] = useState("5000");
  const [travelers, setTravelers] = useState("2");
  const [interests, setInterests] = useState(["nature", "history"]);

  const [itinerary, setItinerary] = useState(null);
  const [plannerError, setPlannerError] = useState("");
  const [savedTrips, setSavedTrips] = useState([]);
  const [savedTripsLoaded, setSavedTripsLoaded] = useState(false);
  const [savedTripsError, setSavedTripsError] = useState("");
  const [savingTrip, setSavingTrip] = useState(false);
  const [weatherResult, setWeatherResult] = useState(null);
  const [emergencyFacilities, setEmergencyFacilities] = useState(null);
  const [emergencyFacilitiesLoading, setEmergencyFacilitiesLoading] =
    useState(false);
  const [emergencyFacilitiesError, setEmergencyFacilitiesError] = useState("");

  const selectedDestination = destinations.find(
    (place) => place.id === destination
  );
  const cultureDestination = selectedDestination;
  const weatherRequestKey = itinerary?.startDate
    ? [
        itinerary.destination,
        itinerary.startDate,
        itinerary.days,
      ].join("|")
    : "";
  const currentWeather =
    weatherResult?.key === weatherRequestKey ? weatherResult : null;
  const hasWeatherLocation = Boolean(
    destinationWeatherLocations[itinerary?.destination]
  );

  useEffect(() => {
    if (!weatherRequestKey) return;

    const [destinationName, tripStartDate, tripDays] =
      weatherRequestKey.split("|");
    const location = destinationWeatherLocations[destinationName];
    if (!location) return;
    const query = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      daily:
        "weather_code,temperature_2m_max,precipitation_probability_max",
      forecast_days: "16",
      timezone: "Asia/Kolkata",
    });
    const controller = new AbortController();

    fetch(`https://api.open-meteo.com/v1/forecast?${query}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("The weather service could not return a forecast.");
        }
        return response.json();
      })
      .then((data) => {
        const daily = data.daily;
        if (
          !Array.isArray(daily?.time) ||
          !Array.isArray(daily.weather_code) ||
          !Array.isArray(daily.temperature_2m_max) ||
          !Array.isArray(daily.precipitation_probability_max)
        ) {
          throw new Error("The weather service returned an invalid forecast.");
        }

        const firstDate = new Date(`${tripStartDate}T00:00:00Z`);
        const forecasts = Array.from(
          { length: Number(tripDays) },
          (_, index) => {
            const date = new Date(firstDate);
            date.setUTCDate(date.getUTCDate() + index);
            const dateString = date.toISOString().slice(0, 10);
            const forecastIndex = daily.time.indexOf(dateString);

            if (forecastIndex < 0) {
              return { date: dateString, available: false };
            }

            const code = daily.weather_code[forecastIndex];
            const high = daily.temperature_2m_max[forecastIndex];
            const rainChance =
              daily.precipitation_probability_max[forecastIndex];
            const warnings = [];

            if ([95, 96, 99].includes(Number(code))) {
              warnings.push(
                "Thunderstorms are possible; reconsider exposed outdoor activities."
              );
            }
            if (Number(rainChance) >= 60) {
              warnings.push(
                "Rain is likely; consider rain protection or rescheduling outdoor stops."
              );
            }
            if (Number(high) >= 35) {
              warnings.push(
                "High temperatures are expected; plan shade, water, and breaks."
              );
            }

            return {
              date: dateString,
              available: true,
              condition: weatherDescriptions[code] || "Conditions unavailable",
              high:
                typeof high === "number" && Number.isFinite(high) ? high : null,
              rainChance:
                typeof rainChance === "number" && Number.isFinite(rainChance)
                  ? rainChance
                  : null,
              warnings,
            };
          }
        );

        setWeatherResult({ key: weatherRequestKey, forecasts });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setWeatherResult({
            key: weatherRequestKey,
            error: "Weather is unavailable right now. Please try again later.",
          });
        }
      });

    return () => controller.abort();
  }, [weatherRequestKey]);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const session = await requestJson("/api/auth/me");
        if (!cancelled) setCurrentUser(session.user);
      } catch (error) {
        if (!cancelled && error.status !== 401) {
          setAccountMessage(error.message);
        }
      } finally {
        if (!cancelled) setAuthChecking(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!currentUser) return;

    requestJson("/api/trips")
      .then(({ trips }) => {
        if (!cancelled) setSavedTrips(trips);
      })
      .catch((error) => {
        if (!cancelled) setSavedTripsError(error.message);
      })
      .finally(() => {
        if (!cancelled) setSavedTripsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setAuthBusy(true);

    try {
      const session = await requestJson(`/api/auth/${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword,
        }),
      });

      setCurrentUser(session.user);
      setSavedTripsLoaded(false);
      setSavedTripsError("");
      setAuthPassword("");
      setShowAuth(false);
      setAccountMessage("");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    try {
      await requestJson("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setSavedTrips([]);
      setSavedTripsLoaded(false);
      setAccountMessage("You have logged out.");
    } catch (error) {
      setAccountMessage(error.message);
    }
  }

  async function saveItinerary() {
    if (!currentUser) {
      setAccountMessage("Log in or create an account to save your trips.");
      openAuth("login");
      return;
    }

    if (!itinerary || itinerary.savedTripId) return;

    setSavedTripsError("");
    setSavingTrip(true);
    try {
      const { trip } = await requestJson("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itinerary }),
      });
      setSavedTrips((current) => [trip, ...current]);
      setItinerary((current) => ({ ...current, savedTripId: trip.id }));
    } catch (error) {
      setSavedTripsError(error.message);
    } finally {
      setSavingTrip(false);
    }
  }

  function loadSavedTrip(trip) {
    const savedDestination = destinations.find(
      (place) => place.name === trip.itinerary.destination
    );
    if (savedDestination) setDestination(savedDestination.id);
    setItinerary({ ...trip.itinerary, savedTripId: trip.id });
    setShowPlanner(true);
    document
      .getElementById("trip-planner")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function deleteSavedTrip(tripId) {
    setSavedTripsError("");
    try {
      await requestJson(`/api/trips/${tripId}`, { method: "DELETE" });
      setSavedTrips((current) => current.filter((trip) => trip.id !== tripId));
      setItinerary((current) =>
        current && current.savedTripId === tripId
          ? { ...current, savedTripId: null }
          : current
      );
    } catch (error) {
      setSavedTripsError(error.message);
    }
  }

  function openAuth(mode) {
    setAuthMode(mode);
    setAuthError("");
    setShowAuth(true);
  }

  function getCurrentLocation() {
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage(
        "Your browser does not support location detection. Please enter your starting city."
      );
      return;
    }

    setLocationMessage("Requesting location permission...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setCoordinates({ lat, lon });

        setLocationMessage(
          `Location detected! Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(
            4
          )}. Please enter your nearest city below so TripWise can label your starting point.`
        );
      },
      (error) => {
        let message =
          "We couldn't access your location. Please enter your starting city manually.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location permission was denied. You can still enter your starting city manually.";
        } else if (error.code === error.TIMEOUT) {
          message =
            "Location detection took too long. Please enter your starting city manually.";
        }

        setLocationMessage(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  async function findEmergencyFacilities() {
    setEmergencyFacilities(null);
    setEmergencyFacilitiesError("");

    if (!navigator.geolocation) {
      setEmergencyFacilitiesError(
        "Your browser does not support location detection. Try a browser with location access."
      );
      return;
    }

    setEmergencyFacilitiesLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000,
        });
      });
      const location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"^(hospital|clinic|doctors|police|pharmacy)$"](around:10000,${location.lat},${location.lon});
          way["amenity"~"^(hospital|clinic|doctors|police|pharmacy)$"](around:10000,${location.lat},${location.lon});
          relation["amenity"~"^(hospital|clinic|doctors|police|pharmacy)$"](around:10000,${location.lat},${location.lon});
        );
        out center tags;
      `;
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: query }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          "Nearby facility data is temporarily unavailable. Please try again."
        );
      }

      const data = await response.json();
      if (!Array.isArray(data.elements)) {
        throw new Error("The map service returned invalid facility data.");
      }

      const facilities = data.elements
        .map((element) => {
          const lat = element.lat ?? element.center?.lat;
          const lon = element.lon ?? element.center?.lon;
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

          const tags = element.tags || {};
          const category = emergencyFacilityGroups.find((group) =>
            group.amenities.includes(tags.amenity)
          );
          if (!category) return null;

          return {
            id: `${element.type}-${element.id}`,
            categoryId: category.id,
            name:
              tags.name ||
              tags["name:en"] ||
              category.fallbackName,
            address: getFacilityAddress(tags),
            lat,
            lon,
            distance: getDistanceInKm(location, { lat, lon }),
          };
        })
        .filter(Boolean);

      setEmergencyFacilities({ location, facilities });
    } catch (error) {
      if (error.name === "AbortError") {
        setEmergencyFacilitiesError(
          "The facility search timed out. Please check your connection and try again."
        );
      } else if (error.code === 1) {
        setEmergencyFacilitiesError(
          "Location permission was denied. Allow location access in your browser and try again."
        );
      } else if (error.code === 2 || error.code === 3) {
        setEmergencyFacilitiesError(
          "Your location could not be determined. Check your device location settings and try again."
        );
      } else {
        setEmergencyFacilitiesError(
          error.message ||
            "Nearby facilities could not be loaded. Please try again."
        );
      }
    } finally {
      window.clearTimeout(timeoutId);
      setEmergencyFacilitiesLoading(false);
    }
  }

  function toggleInterest(value) {
    setInterests((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function createItinerary(event) {
    event.preventDefault();
    setPlannerError("");
    setItinerary(null);

    if (!startingCity.trim()) {
      setPlannerError(
        "Please enter your starting city or use the location button and then enter your nearest city."
      );
      return;
    }

    const numberOfDays = Number(days);
    const numberOfTravelers = Number(travelers);
    const totalBudget = Number(budget);

    if (
      !Number.isFinite(totalBudget) ||
      totalBudget <= 0 ||
      numberOfTravelers < 1
    ) {
      setPlannerError("Please enter a valid budget and number of travellers.");
      return;
    }

    const matchingPlaces = selectedDestination.places.filter((place) => {
      if (interests.length === 0) return true;
      return place.tags.some((tag) => interests.includes(tag));
    });

    const placesToUse =
      matchingPlaces.length > 0 ? matchingPlaces : selectedDestination.places;

    const dayPlans = Array.from({ length: numberOfDays }, (_, index) => {
      const dayNumber = index + 1;
      const dayPlaces = placesToUse.filter(
        (place) => place.day === dayNumber
      );

      return { day: dayNumber, places: dayPlaces };
    });

    setItinerary({
      origin: startingCity.trim(),
      destination: selectedDestination.name,
      startDate,
      days: numberOfDays,
      budget: totalBudget,
      travelers: numberOfTravelers,
      interests: [...interests],
      coordinates,
      dayPlans,
    });
  }

  function scrollToPlanner() {
    setShowPlanner(true);

    setTimeout(() => {
      document
        .getElementById("trip-planner")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a className="logo" href="#home">
          <span className="logo-icon">✈</span> TripWise
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#destinations">Destinations</a>
          <a href="#emergency">Emergency help</a>
          <a href="#guide">Digital Guide</a>
        </div>

        <div className="nav-actions">
          <button className="nav-button" onClick={scrollToPlanner}>
            Plan My Trip
          </button>
          {!authChecking &&
            (currentUser ? (
              <>
                <span className="account-name">Hi, {currentUser.name}</span>
                <button
                  className="secondary-button nav-auth-button"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  className="secondary-button nav-auth-button"
                  onClick={() => openAuth("login")}
                >
                  Log in
                </button>
                <button
                  className="text-button nav-signup-button"
                  onClick={() => openAuth("register")}
                >
                  Sign up
                </button>
              </>
            ))}
        </div>
      </nav>

      {accountMessage && (
        <p className="account-message" role="status">
          {accountMessage}
        </p>
      )}

      {showAuth && (
        <div
          className="auth-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAuth(false);
          }}
        >
          <section
            className="auth-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="auth-close"
              type="button"
              aria-label="Close account form"
              onClick={() => setShowAuth(false)}
            >
              ×
            </button>
            <p className="eyebrow">TRIPWISE ACCOUNT</p>
            <h2 id="auth-title">
              {authMode === "register" ? "Create an account" : "Log in"}
            </h2>
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === "register" && (
                <>
                  <label htmlFor="auth-name">Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={authName}
                    onChange={(event) => setAuthName(event.target.value)}
                    required
                  />
                </>
              )}
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                required
              />
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                autoComplete={
                  authMode === "register" ? "new-password" : "current-password"
                }
                minLength={8}
                maxLength={72}
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                required
              />
              {authError && (
                <p className="planner-error" role="alert">
                  {authError}
                </p>
              )}
              <button
                className="primary-button"
                type="submit"
                disabled={authBusy}
              >
                {authBusy
                  ? "Please wait..."
                  : authMode === "register"
                    ? "Create account"
                    : "Log in"}
              </button>
            </form>
            <button
              className="text-button auth-mode-toggle"
              type="button"
              onClick={() => {
                setAuthMode(authMode === "register" ? "login" : "register");
                setAuthError("");
              }}
            >
              {authMode === "register"
                ? "Already registered? Log in"
                : "New here? Create an account"}
            </button>
          </section>
        </div>
      )}

      <header className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">YOUR JOURNEY, YOUR WAY</p>
          <h1>Discover Karnataka, one journey at a time.</h1>
          <p className="hero-description">
            Find beautiful places, learn their stories, and create a trip
            plan that suits your interests, time, and budget.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={scrollToPlanner}>
              Plan Your Journey
            </button>
            <a className="secondary-button" href="#destinations">
              Explore Destinations
            </a>
          </div>

          <p className="hero-note">
            Discover places • Personalised plans • Local stories
          </p>
        </div>
      </header>

      <main>
        <section className="intro-section">
          <p className="eyebrow">TRAVEL WITH A PLAN</p>
          <h2>More than just a destination</h2>
          <p>
            TripWise helps you discover places and organise your trip. Explore
            what makes each destination special, then build a day-wise plan
            around your preferences.
          </p>
        </section>

        <section className="emergency-section" id="emergency">
          <div className="emergency-content">
            <div className="section-heading">
              <div>
                <p className="eyebrow">HELP CLOSE BY</p>
                <h2>Emergency facilities nearby</h2>
                <p>
                  Find hospitals and clinics, police stations, and pharmacies
                  around your current location.
                </p>
              </div>
              <button
                className="primary-button"
                type="button"
                onClick={findEmergencyFacilities}
                disabled={emergencyFacilitiesLoading}
              >
                {emergencyFacilitiesLoading
                  ? "Finding nearby facilities..."
                  : emergencyFacilities
                    ? "Refresh nearby facilities"
                    : "Use my location"}
              </button>
            </div>

            {emergencyFacilitiesError && (
              <p className="emergency-error" role="alert">
                {emergencyFacilitiesError}
              </p>
            )}

            {emergencyFacilitiesLoading && (
              <p className="emergency-status" role="status">
                Requesting your location and searching within 10 km...
              </p>
            )}

            {emergencyFacilities && (
              <>
                <p className="emergency-status" role="status">
                  Showing facilities within 10 km of{" "}
                  {emergencyFacilities.location.lat.toFixed(4)},{" "}
                  {emergencyFacilities.location.lon.toFixed(4)}. Distances are
                  straight-line estimates.
                </p>
                <div className="emergency-grid">
                  {emergencyFacilityGroups.map((group) => {
                    const facilities = emergencyFacilities.facilities
                      .filter((facility) => facility.categoryId === group.id)
                      .sort((first, second) => first.distance - second.distance)
                      .slice(0, 5);

                    return (
                      <section
                        className="emergency-category"
                        key={group.id}
                        aria-labelledby={`emergency-${group.id}`}
                      >
                        <h3 id={`emergency-${group.id}`}>{group.label}</h3>
                        {facilities.length ? (
                          <ul className="emergency-list">
                            {facilities.map((facility) => (
                              <li
                                className="emergency-facility"
                                key={facility.id}
                              >
                                <h4>{facility.name}</h4>
                                <p>{facility.address}</p>
                                <div className="emergency-facility-footer">
                                  <span>
                                    {facility.distance < 1
                                      ? `${Math.round(
                                          facility.distance * 1000
                                        )} m away`
                                      : `${facility.distance.toFixed(
                                          1
                                        )} km away`}
                                  </span>
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${facility.lat},${facility.lon}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Directions
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="emergency-empty">
                            No mapped facilities found in this category within
                            10 km.
                          </p>
                        )}
                      </section>
                    );
                  })}
                </div>
                <p className="emergency-note">
                  Map data © OpenStreetMap contributors. Listings may be
                  incomplete or out of date; call ahead where possible. This
                  tool is not an emergency dispatch service.
                  {" "}
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer"
                  >
                    About the map data
                  </a>
                </p>
              </>
            )}

            {!emergencyFacilities && !emergencyFacilitiesLoading && (
              <p className="emergency-note">
                Your location is only used to search the OpenStreetMap data
                service after you select the button. Location access requires
                your permission.
              </p>
            )}
          </div>
        </section>

        <section className="destinations-section" id="destinations">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR NEXT ADVENTURE</p>
              <h2>Explore beautiful Karnataka</h2>
            </div>
            <button className="text-button" onClick={scrollToPlanner}>
              Create an itinerary →
            </button>
          </div>

          <div className="place-grid">
            {destinations.map((place) => (
              <article className="destination-card" key={place.id}>
                <img
                  className="destination-image"
                  src={place.image}
                  alt={`Scenic destination inspiration for ${place.name}`}
                  loading="lazy"
                />

                <div className="destination-card-content">
                  <p className="destination-subtitle">{place.subtitle}</p>
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>

                  <button
                    className="text-button"
                    onClick={() => {
                      chooseFeaturedDestination(place.id);
                      scrollToPlanner();
                    }}
                  >
                    Plan a trip here →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="planner-section" id="trip-planner">
          <div className="planner-intro">
            <p className="eyebrow">YOUR TRIP STARTS HERE</p>
            <h2>Build your personalised itinerary</h2>
            <p>
              Tell us where you're starting, where you want to go, and what
              you enjoy. TripWise will organise available attractions into a
              day-wise plan.
            </p>
          </div>

          {!showPlanner && (
            <button
              className="primary-button"
              onClick={() => setShowPlanner(true)}
            >
              Open Trip Planner
            </button>
          )}

          {showPlanner && (
            <form className="planner" onSubmit={createItinerary}>
              <div className="form-section-heading">
                <span className="step-number">1</span>
                <div>
                  <h3>Your starting point</h3>
                  <p>Where will your journey begin?</p>
                </div>
              </div>

              <div className="location-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={getCurrentLocation}
                >
                  <span aria-hidden="true">⌖</span> Use My Current Location
                </button>
              </div>

              <label htmlFor="startingCity">Starting city</label>
              <input
                id="startingCity"
                type="text"
                value={startingCity}
                onChange={(event) => setStartingCity(event.target.value)}
                placeholder="For example, Mysuru or Bengaluru"
                required
              />

              {locationMessage && (
                <p className="location-message" role="status">
                  {locationMessage}
                </p>
              )}

              {coordinates && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setCoordinates(null);
                    setLocationMessage("Saved device coordinates cleared.");
                  }}
                >
                  Clear detected coordinates
                </button>
              )}

              <div className="form-section-heading">
                <span className="step-number">2</span>
                <div>
                  <h3>Your destination</h3>
                  <p>Choose where you would like to explore.</p>
                </div>
              </div>

              <label htmlFor="destination">Choose a destination</label>
              <select
                id="destination"
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  setItinerary(null);
                }}
              >
                {destinations.map((place) => (
                  <option value={place.id} key={place.id}>
                    {place.name} — {place.subtitle}
                  </option>
                ))}
              </select>

              <div className="form-grid">
                <div>
                  <label htmlFor="startDate">Departure date</label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="days">Trip duration</label>
                  <select
                    id="days"
                    value={days}
                    onChange={(event) => setDays(event.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((day) => (
                      <option key={day} value={day}>
                        {day} {day === 1 ? "day" : "days"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="budget">Total budget (₹)</label>
                  <input
                    id="budget"
                    type="number"
                    min="1"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="travelers">Number of travellers</label>
                  <input
                    id="travelers"
                    type="number"
                    min="1"
                    max="50"
                    value={travelers}
                    onChange={(event) => setTravelers(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-section-heading">
                <span className="step-number">3</span>
                <div>
                  <h3>What do you enjoy?</h3>
                  <p>Select all the interests you want to include.</p>
                </div>
              </div>

              <div className="interest-grid">
                {interestOptions.map((interest) => (
                  <label className="interest-option" key={interest.value}>
                    <input
                      type="checkbox"
                      checked={interests.includes(interest.value)}
                      onChange={() => toggleInterest(interest.value)}
                    />
                    <span>{interest.label}</span>
                  </label>
                ))}
              </div>

              {plannerError && (
                <p className="planner-error" role="alert">
                  {plannerError}
                </p>
              )}

              <button
                className="primary-button generate-button"
                type="submit"
              >
                Generate My Itinerary
              </button>

              <p className="planner-disclaimer">
                Places, opening hours, ticket prices, and availability can
                change. Confirm current details with each venue before you go.
              </p>
            </form>
          )}

          {currentUser && (
            <div className="saved-trips">
              <h3>My saved trips</h3>
              {!savedTripsLoaded ? (
                <p>Loading your saved trips...</p>
              ) : savedTrips.length === 0 ? (
                <p>You have no saved trips yet.</p>
              ) : (
                <ul>
                  {savedTrips.map((trip) => (
                    <li key={trip.id}>
                      <span>
                        {trip.itinerary.origin} → {trip.itinerary.destination}
                      </span>
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => loadSavedTrip(trip)}
                      >
                        View
                      </button>
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => deleteSavedTrip(trip.id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {savedTripsError && (
                <p className="planner-error" role="alert">
                  {savedTripsError}
                </p>
              )}
            </div>
          )}

          {itinerary && (
            <div className="trip-message">
              <div className="itinerary-header">
                <p className="eyebrow">YOUR TRIP PLAN</p>
                <h3>
                  {itinerary.origin} → {itinerary.destination}
                </h3>
                <p>
                  {itinerary.startDate
                    ? `Departure: ${itinerary.startDate}`
                    : "Choose a departure date when you are ready to travel"}
                </p>
                <p>
                  {itinerary.days} days · {itinerary.travelers} traveller(s) ·
                  Total budget: ₹{itinerary.budget.toLocaleString("en-IN")}
                </p>

                {itinerary.coordinates && (
                  <p className="location-message">
                    Device coordinates detected:{" "}
                    {itinerary.coordinates.lat.toFixed(4)},{" "}
                    {itinerary.coordinates.lon.toFixed(4)}
                  </p>
                )}

                <p className="planner-disclaimer">
                  The starting city is included in your plan, but route
                  distances and travel times have not yet been calculated.
                  Budget is your entered trip budget, not a verified cost
                  estimate.
                </p>
              </div>

              <section className="weather-outlook" aria-live="polite">
                <div className="weather-heading">
                  <h4>Weather outlook</h4>
                  <a
                    href="https://open-meteo.com/en/licence"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Weather data: Open-Meteo (CC BY 4.0)
                  </a>
                </div>

                {!itinerary.startDate ? (
                  <p>Choose a departure date to see the forecast.</p>
                ) : !hasWeatherLocation ? (
                  <p>
                    Weather is unavailable for this destination right now.
                  </p>
                ) : !currentWeather ? (
                  <p>Checking the forecast for your trip dates...</p>
                ) : currentWeather.error ? (
                  <p className="weather-error" role="status">
                    {currentWeather.error}
                  </p>
                ) : (
                  <div className="weather-day-grid">
                    {currentWeather.forecasts.map((forecast, index) => (
                      <article
                        className={`weather-day${
                          forecast.warnings?.length
                            ? " weather-day-warning"
                            : ""
                        }`}
                        key={forecast.date}
                      >
                        <h5>
                          Day {index + 1} · {formatForecastDate(forecast.date)}
                        </h5>
                        {forecast.available ? (
                          <>
                            <p className="weather-condition">
                              {forecast.condition}
                            </p>
                            <p>
                              {forecast.high !== null &&
                                `High ${Math.round(forecast.high)}°C`}
                              {forecast.high !== null &&
                                forecast.rainChance !== null &&
                                " · "}
                              {forecast.rainChance !== null &&
                                `${forecast.rainChance}% rain chance`}
                            </p>
                            {forecast.warnings.length > 0 ? (
                              <ul className="weather-warnings">
                                {forecast.warnings.map((warning) => (
                                  <li key={warning}>{warning}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="weather-clear">
                                No heavy-rain, thunderstorm, or extreme-heat
                                caution detected in this forecast.
                              </p>
                            )}
                          </>
                        ) : (
                          <p>
                            Forecast not available yet. Check again within 16
                            days of departure.
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                <p className="weather-note">
                  Forecasts are estimates, available up to 16 days ahead.
                  Check local advisories before changing your plans.
                </p>
              </section>

              <div className="itinerary-days">
                {itinerary.dayPlans.map((dayPlan) => (
                  <article className="itinerary-day" key={dayPlan.day}>
                    <h4>Day {dayPlan.day}</h4>

                    {dayPlan.places.length === 0 ? (
                      <p>
                        No matching attractions are available for this day in
                        our current sample data. Try another interest or a
                        shorter trip.
                      </p>
                    ) : (
                      <div className="itinerary-places">
                        {dayPlan.places.map((place) => (
                          <div
                            className="itinerary-place"
                            key={place.name}
                          >
                            <p className="place-time">{place.time}</p>
                            <h5>{place.name}</h5>
                            <p>{place.description}</p>
                            <p className="place-tip">
                              <strong>Travel tip:</strong> {place.tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>

              <button
                className="secondary-button"
                type="button"
                onClick={saveItinerary}
                disabled={Boolean(itinerary.savedTripId) || savingTrip}
              >
                {itinerary.savedTripId
                  ? "Trip Saved"
                  : savingTrip
                    ? "Saving..."
                    : "Save This Trip"}
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setItinerary(null);
                  setShowPlanner(true);
                  document
                    .getElementById("trip-planner")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Edit My Trip
              </button>
            </div>
          )}
        </section>

        <section className="guide-section" id="guide">
          <div className="guide-content">
            <p className="eyebrow">TRAVEL WITH LOCAL INSIGHT</p>
            <h2>Explore the culture behind every destination.</h2>
            <p>
              Discover regional dishes, living traditions, useful Kannada
              phrases, respectful travel tips, and locally made specialties.
            </p>
          </div>

          <div className="culture-explorer">
            <div className="culture-destination-heading">
              <div>
                <p className="eyebrow">YOUR LOCAL GUIDE</p>
                <h3>{cultureDestination.name}</h3>
                <p>{cultureGuides[destination].intro}</p>
              </div>
              <label>
                <span>Choose a destination</span>
                <select
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  aria-label="Choose a destination for the culture guide"
                >
                  {destinations.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="culture-card-grid">
              <article className="culture-card">
                <span className="culture-card-icon" aria-hidden="true">
                  🍲
                </span>
                <h4>Famous regional dishes</h4>
                <ul>
                  {cultureGuides[destination].dishes.map((dish) => (
                    <li key={dish}>{dish}</li>
                  ))}
                </ul>
              </article>

              <article className="culture-card">
                <span className="culture-card-icon" aria-hidden="true">
                  🎉
                </span>
                <h4>Traditions & festivals</h4>
                <ul>
                  {cultureGuides[destination].traditions.map((tradition) => (
                    <li key={tradition}>{tradition}</li>
                  ))}
                </ul>
              </article>

              <article className="culture-card">
                <span className="culture-card-icon" aria-hidden="true">
                  💬
                </span>
                <h4>Useful Kannada phrases</h4>
                <ul className="phrase-list">
                  {kannadaPhrases.map((phrase) => (
                    <li key={phrase.phrase}>
                      <span className="phrase-kannada">{phrase.kannada}</span>
                      <span>{phrase.phrase}</span>
                      <span className="phrase-meaning">{phrase.meaning}</span>
                    </li>
                  ))}
                </ul>
                <p className="culture-note">
                  Kannada is useful across the state; local languages and
                  dialects also vary by community.
                </p>
              </article>

              <article className="culture-card">
                <span className="culture-card-icon" aria-hidden="true">
                  🤝
                </span>
                <h4>Cultural etiquette</h4>
                <ul>
                  {cultureGuides[destination].etiquette.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </article>

              <article className="culture-card culture-specialties">
                <span className="culture-card-icon" aria-hidden="true">
                  🧺
                </span>
                <h4>Local specialties</h4>
                <ul>
                  {cultureGuides[destination].specialties.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="culture-footer">
              <p>
                Festival schedules, customs, and availability can change.
                Confirm details with local hosts or official visitor sources.
              </p>
              <a
                href="https://karnatakatourism.org/en/"
                target="_blank"
                rel="noreferrer"
              >
                Visit Karnataka Tourism
              </a>
            </div>

            <button className="primary-button culture-planner-button" onClick={scrollToPlanner}>
              Plan a trip to {cultureDestination.name}
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="logo" href="#home">
          <span className="logo-icon">✈</span> TripWise
        </a>
        <p>Discover more. Plan smarter. Travel meaningfully.</p>
        <p>Student project · MERN Stack</p>
      </footer>
    </div>
  );
}

export default App;