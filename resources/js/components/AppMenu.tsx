import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router";

import logo from "../../images/logo.webp";
import { paths } from "../routes";
import { HelpDropdown } from "./HelpDropdown";

interface AppMenuProps {
    drawerWidth?: number;
    onAppMenuClick?: () => void;
}

export function AppMenu({ onAppMenuClick, drawerWidth }: AppMenuProps) {
    return (
        <AppBar
            color="success"
            component="nav"
            position="fixed"
            sx={{
                width: { md: `calc(100% - ${drawerWidth || 0}px)` },
                ml: { md: `${drawerWidth || 0}px` },
                flexGrow: 1,
                whiteSpace: "nowrap",
            }}
        >
            <Toolbar
                sx={{
                    pl: 2,
                }}
            >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={onAppMenuClick}
                    sx={{
                        mr: {
                            xs: 0.5,
                            lg: 2,
                        },
                        display: { md: "none" },
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <img src={logo} width="35" alt="Logo" />
                <Typography
                    variant="h6"
                    noWrap
                    to={paths.home}
                    component={RouterLink}
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        px: {
                            xs: 0.5,
                            lg: 1,
                        },
                    }}
                >
                    Tee Time Scout
                </Typography>
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
        </AppBar>
    );
}
