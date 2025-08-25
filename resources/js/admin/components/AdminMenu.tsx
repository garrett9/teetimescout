import { SportsGolf } from "@mui/icons-material";
import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";

import { useSubmit } from "../../hooks/useSubmit";
import { paths } from "../../routes";
import { paths as adminPaths } from "../routes";

export function AdminMenu() {
    const { submit, inProgress } = useSubmit({
        path: "/api/logout",
        onSuccess: () => {
            window.location.href = paths.home;
        },
    });

    return (
        <AppBar position="sticky">
            <Container>
                <Toolbar sx={{ px: "0px !important" }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexGrow: 1,
                            alignItems: "center",
                        }}
                    >
                        <SportsGolf sx={{ mr: 2 }} />{" "}
                        <Typography
                            component={Link}
                            to={adminPaths.courses.index}
                        >
                            Tee Time Scout Admin
                        </Typography>
                    </Typography>
                    <Button
                        loading={inProgress}
                        onClick={submit}
                        type="button"
                        variant="text"
                        sx={{
                            color: "white",
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
