import React from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS } from "date-fns/locale/en-US";
import Radar from "radar-sdk-js";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

import { AppRoutes } from "./AppRoutes";
import { UserPreferencesProvider } from "./providers/UserPreferences";
import theme from "./theme"; // with date-fns v3.x or v4.x

export function App() {
    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={enUS}
                >
                    <UserPreferencesProvider>
                        <CssBaseline />
                        <BrowserRouter>
                            <AppRoutes />
                        </BrowserRouter>
                    </UserPreferencesProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById("app")!).render(<App />);

Radar.initialize(import.meta.env.VITE_RADAR_PK);
