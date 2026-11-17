# TripWise API

## MongoDB setup

Install and start MongoDB locally, then set `MONGODB_URI` in `server/.env` to
`mongodb://127.0.0.1:27017/tripwise`. Alternatively, use a MongoDB Atlas
connection string. Keep `.env` local and do not commit credentials.

Install dependencies and run the API from this directory:

```sh
npm install
npm run dev
```

On startup, Mongoose connects to MongoDB and creates the required collections
and indexes. The client runs at `http://localhost:5173` and proxies `/api`
requests to `http://localhost:5000`.

The database health check is available at `GET /api/test-db`. Register or log
in before using `GET /api/trips`, `POST /api/trips`, and `DELETE /api/trips/:id`.
Trips are private to the authenticated account.

The previous MySQL database is not modified or migrated. New accounts and trips
are stored in MongoDB.
