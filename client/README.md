# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Trip weather outlook

When a departure date is selected, the itinerary displays a daily weather
outlook for the chosen Karnataka destination. Forecasts use Open-Meteo and
require an internet connection; they are available up to 16 days ahead.
Weather cautions are estimates, not official emergency alerts, so travellers
should check local advisories before changing plans.

## Local culture and food explorer

The Digital Guide destination selector shows curated regional dishes,
traditions and festival context, Kannada travel phrases, etiquette tips, and
local specialties for Coorg, Mysuru, Hampi, and Chikmagalur. Festival dates
and local practices can vary; confirm current details with local hosts or
official visitor sources.

## Nearby emergency facilities

The Emergency help section can use the browser's location permission to search
for hospitals and clinics, police stations, and pharmacies within 10 km. It
uses OpenStreetMap facility data and links each result to map directions.
Results include mapped names, addresses when available, and straight-line
distance estimates. Map coverage and details may be incomplete or out of date;
this feature is not an emergency dispatch service.
