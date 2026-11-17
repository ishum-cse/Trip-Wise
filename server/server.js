const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const { connectDatabase, mongoose } = require("./db");
const { Trip, User, UserSession } = require("./models");

const app = express();
const SESSION_COOKIE = "tripwise_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

function getSessionToken(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const sessionCookie = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));

  return sessionCookie
    ? sessionCookie.slice(`${SESSION_COOKIE}=`.length)
    : null;
}

function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_DURATION_SECONDS}${secure}`
  );
}

function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`
  );
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);

  await UserSession.create({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + SESSION_DURATION_SECONDS * 1000),
  });

  return token;
}

async function requireAuth(req, res, next) {
  const token = getSessionToken(req);

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  try {
    const session = await UserSession.findOne({
      tokenHash: hashSessionToken(token),
      expiresAt: { $gt: new Date() },
    }).populate("userId", "name email");
    const account = session && session.userId;

    if (!account) {
      clearSessionCookie(res);
      return res.status(401).json({ message: "Please log in to continue." });
    }

    req.user = {
      id: account._id.toString(),
      name: account.name,
      email: account.email,
    };
    return next();
  } catch (error) {
    console.error("Could not verify user session:", error);
    return res.status(500).json({ message: "Could not verify your session." });
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the TripWise API!",
    status: "Backend is running successfully",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();

    res.json({
      message: "TripWise connected to MongoDB successfully!",
      database: mongoose.connection.name,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Could not connect to the TripWise database.",
    });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const body = req.body || {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const passwordLength = Buffer.byteLength(password, "utf8");

  if (
    !name ||
    name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    passwordLength < 8 ||
    passwordLength > 72
  ) {
    return res.status(400).json({
      message:
        "Enter your name, a valid email, and a password between 8 and 72 bytes.",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const account = await User.create({ name, email, passwordHash });
    const user = { id: account._id.toString(), name, email };
    const token = await createSession(user.id);

    setSessionCookie(res, token);
    return res.status(201).json({ user });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    }

    console.error("Could not register user:", error);
    return res.status(500).json({ message: "Could not create your account." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const body = req.body || {};
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return res.status(400).json({ message: "Enter your email and password." });
  }

  try {
    const account = await User.findOne({ email }).select("+passwordHash");

    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    const user = {
      id: account._id.toString(),
      name: account.name,
      email: account.email,
    };
    const token = await createSession(user.id);

    setSessionCookie(res, token);
    return res.json({ user });
  } catch (error) {
    console.error("Could not log in user:", error);
    return res.status(500).json({ message: "Could not log in." });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  const token = getSessionToken(req);

  try {
    if (token) {
      await UserSession.deleteOne({ tokenHash: hashSessionToken(token) });
    }

    clearSessionCookie(res);
    return res.json({ message: "Logged out." });
  } catch (error) {
    console.error("Could not log out user:", error);
    clearSessionCookie(res);
    return res.status(500).json({ message: "Could not log out." });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/trips", requireAuth, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({
      trips: trips.map((trip) => ({
        id: trip._id.toString(),
        itinerary: trip.itinerary,
        createdAt: trip.createdAt,
      })),
    });
  } catch (error) {
    console.error("Could not load saved trips:", error);
    return res.status(500).json({ message: "Could not load your saved trips." });
  }
});

app.post("/api/trips", requireAuth, async (req, res) => {
  const itinerary = req.body && req.body.itinerary;
  const days = Number(itinerary && itinerary.days);
  const validItinerary =
    itinerary &&
    typeof itinerary.origin === "string" &&
    itinerary.origin.trim().length > 0 &&
    itinerary.origin.length <= 100 &&
    typeof itinerary.destination === "string" &&
    itinerary.destination.trim().length > 0 &&
    itinerary.destination.length <= 100 &&
    Number.isInteger(days) &&
    days >= 1 &&
    days <= 5 &&
    Number.isFinite(itinerary.budget) &&
    itinerary.budget > 0 &&
    Number.isInteger(itinerary.travelers) &&
    itinerary.travelers >= 1 &&
    itinerary.travelers <= 50 &&
    Array.isArray(itinerary.interests) &&
    Array.isArray(itinerary.dayPlans) &&
    itinerary.dayPlans.length === days &&
    itinerary.dayPlans.every(
      (dayPlan, index) =>
        dayPlan &&
        dayPlan.day === index + 1 &&
        Array.isArray(dayPlan.places)
    );

  if (!validItinerary) {
    return res.status(400).json({ message: "The itinerary is not valid." });
  }

  try {
    const trip = await Trip.create({ userId: req.user.id, itinerary });

    return res.status(201).json({
      trip: {
        id: trip._id.toString(),
        itinerary: trip.itinerary,
        createdAt: trip.createdAt,
      },
    });
  } catch (error) {
    console.error("Could not save trip:", error);
    return res.status(500).json({ message: "Could not save your trip." });
  }
});

app.delete("/api/trips/:id", requireAuth, async (req, res) => {
  if (!/^[a-f0-9]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ message: "The trip ID is not valid." });
  }

  try {
    const result = await Trip.deleteOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Saved trip was not found." });
    }

    return res.json({ message: "Trip deleted." });
  } catch (error) {
    console.error("Could not delete saved trip:", error);
    return res.status(500).json({ message: "Could not delete your trip." });
  }
});

const PORT = process.env.PORT || 5000;

async function connectDatabaseWithRetry() {
  let retryDelayMs = 2000;

  while (true) {
    try {
      await connectDatabase();
      return;
    } catch (error) {
      console.error(
        `MongoDB connection failed. Retrying in ${retryDelayMs / 1000} seconds:`,
        error.message
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      retryDelayMs = Math.min(retryDelayMs * 2, 30000);
    }
  }
}

connectDatabaseWithRetry()
  .then(() => {
    return Promise.all([User.init(), UserSession.init(), Trip.init()]);
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`TripWise server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB or initialize models:", error);
    process.exitCode = 1;
  });
