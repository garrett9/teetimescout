import React from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import Radar from "radar-sdk-js";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

import theme from "../theme";
import { AdminRoutes } from "./AdminRoutes";
import { AdminMenu } from "./components/AdminMenu";

export function App() {
    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <ConfirmProvider
                        defaultOptions={{
                            title: "Are you sure?",
                            confirmationText: "Yes",
                            cancellationButtonProps: {
                                color: "error",
                            },
                            dialogActionsProps: {
                                sx: {
                                    gap: 1,
                                },
                            },
                        }}
                    >
                        <AdminMenu />
                        <Container>
                            <AdminRoutes />
                        </Container>
                    </ConfirmProvider>
                </BrowserRouter>
            </ThemeProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById("app")!).render(<App />);

Radar.initialize(import.meta.env.VITE_RADAR_PK);
