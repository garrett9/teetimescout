import { PropsWithChildren } from "react";

import {
    AppBar,
    Box,
    Button,
    Container,
    Toolbar,
    Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router";

import logo from "../../images/logo.webp";
import { paths } from "../routes";
import { HelpDropdown } from "./HelpDropdown";

export function AppContainer({ children }: PropsWithChildren) {
    return (
        <Box sx={{ display: "flex", pb: 6 }}>
            <AppBar
                color="success"
                component="nav"
                position="fixed"
                sx={{
                    whiteSpace: "nowrap",
                }}
            >
                <Container>
                    <Toolbar
                        sx={{
                            px: "0 !important",
                        }}
                    >
                        <img src={logo} width="40" alt="Logo" />
                        <Typography
                            sx={{
                                textDecoration: "none",
                                color: "inherit",
                                px: 1,
                            }}
                            variant="h6"
                            noWrap
                            to={paths.home}
                            component={RouterLink}
                        >
                            <i>Tee Time Scout</i>
                        </Typography>
                        <Button
                            color="inherit"
                            variant="text"
                            size="small"
                            to={paths.home}
                            component={RouterLink}
                            sx={{
                                p: 1,
                                px: 2,
                            }}
                        >
                            Tee Times Near Me
                        </Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button
                            color="inherit"
                            variant="text"
                            size="small"
                            to={paths.courses}
                            component={RouterLink}
                            sx={{
                                p: 1,
                                px: 2,
                            }}
                        >
                            Course Directory
                        </Button>
                        <HelpDropdown />
                    </Toolbar>
                </Container>
            </AppBar>
            <Container component="main">
                <>
                    <Toolbar sx={{ mt: 5 }} /> {children}
                </>
            </Container>
        </Box>
    );
}
