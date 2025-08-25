import { useState } from "react";

import { ArrowDropDown, Search, Send } from "@mui/icons-material";
import {
    Button,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { Link } from "react-router";

import { paths } from "../routes";

export function HelpDropdown() {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();
    return (
        <>
            <Button
                color="inherit"
                variant="text"
                size="small"
                sx={{
                    p: 1,
                }}
                onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
                Help <ArrowDropDown fontSize="small" />
            </Button>
            <Menu
                anchorEl={menuAnchor}
                onClose={() => setMenuAnchor(undefined)}
                open={Boolean(menuAnchor)}
            >
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
