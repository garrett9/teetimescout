import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";

import { useSubmit } from "../hooks/useSubmit";

interface Credentials {
    email: string;
    password: string;
}

export function Login() {
    const [isCheckingUser, setIsCheckingUser] = useState<boolean>(false);

    useEffect(() => {
        axios.get("/sanctum/csrf-cookie");
        axios
            .get("/api/users/me")
            .then(() => {
                window.location.href = "/admin";
            })
            .catch(() => {
                // Do nothing
            })
            .finally(() => {
                setIsCheckingUser(false);
            });
    }, []);

    const [credentials, setCredentials] = useState<Credentials>({
        email: "",
        password: "",
    });
    const { inProgress, submit, succeeded } = useSubmit<{}, Credentials>({
        path: "/api/login",
        config: {
            method: "POST",
            data: credentials,
        },
        onSuccess: () => {
            window.location.href = "/admin";
        },
        redirectIfUnauthenticated: false,
    });

    return (
        <Container
            maxWidth="sm"
            sx={{
                pt: 10,
            }}
        >
            <Card>
                <CardContent>
                    {isCheckingUser && (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <CircularProgress color="success" size="3rem" />
                        </Box>
                    )}
                    {!isCheckingUser && (
                        <Stack component="form" onSubmit={submit}>
                            <Typography variant="h5">Login</Typography>
                            <TextField
                                type="text"
                                required
                                label="Email"
                                error={succeeded === false}
                                helperText={
                                    succeeded === false
                                        ? "Invalid email/password combination"
                                        : null
                                }
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                type="password"
                                required
                                label="Password"
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        password: e.target.value,
                                    })
                                }
                            />
                            <Button loading={inProgress} type="submit">
                                Login
                            </Button>
                        </Stack>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}
