import { useState } from "react";

import {
    ArrowDropDown,
    GolfCourse,
    Search,
    Send,
    SportsGolf,
} from "@mui/icons-material";
import {
    Button,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    SxProps,
    Theme,
} from "@mui/material";
import { Link } from "react-router";

import { paths } from "../routes";

interface MenuDropdownProps {
    sx?: SxProps<Theme>;
}

export function MenuDropdown({ sx }: MenuDropdownProps) {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();

    return (
        <>
            <Button
                color="inherit"
                variant="text"
                size="small"
                sx={{
                    ...sx,
                    p: 1,
                }}
                onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
                Menu <ArrowDropDown fontSize="small" />
            </Button>
            <Menu
                anchorEl={menuAnchor}
                onClose={() => setMenuAnchor(undefined)}
                open={Boolean(menuAnchor)}
            >
                <MenuItem component={Link} to={paths.home}>
                    <ListItemIcon>
                        <SportsGolf />
                    </ListItemIcon>
                    <ListItemText primary="Tee Times Near Me" />
                </MenuItem>
                <MenuItem component={Link} to={paths.courses}>
                    <ListItemIcon>
                        <GolfCourse />
                    </ListItemIcon>
                    <ListItemText primary="Course Directory" />
                </MenuItem>
                <MenuItem component={Link} to={paths.requestCourse}>
                    <ListItemIcon>
                        <Search />
                    </ListItemIcon>
                    <ListItemText primary="Don't see a course?" />
                </MenuItem>
                <MenuItem component={Link} to={paths.contact}>
                    <ListItemIcon>
                        <Send />
                    </ListItemIcon>{" "}
                    <ListItemText primary="Contact" />
                </MenuItem>
            </Menu>
        </>
    );
}
