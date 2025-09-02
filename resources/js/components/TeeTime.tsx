import { Flag, Group } from "@mui/icons-material";
import { Box, Button, Card, Stack, Typography } from "@mui/material";

import { TeeTime as TeeTimeInstance } from "../types/TeeTime";

interface TeeTimeProps {
    teeTime: TeeTimeInstance;
}

export function TeeTime({ teeTime }: TeeTimeProps) {
    const teeTimeDate = new Date(teeTime.time);
    const teeTimeString = teeTimeDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    const priceFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });
    const minPrice = priceFormatter.format(teeTime.min_price / 100);
    const maxPrice = priceFormatter.format(teeTime.max_price / 100);

    const priceDisplay =
        minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;

    const playersDisplay =
        teeTime.min_players === teeTime.max_players
            ? teeTime.min_players
            : `${teeTime.min_players} - ${teeTime.max_players}`;

    const holesDisplay =
        teeTime.min_holes === teeTime.max_holes
            ? teeTime.min_holes
            : `${teeTime.min_holes} - ${teeTime.max_holes}`;

    return (
        <Card
            sx={{
                p: 2,
                whiteSpace: "nowrap",
            }}
        >
            <Stack
                spacing={0}
                textAlign="center"
                sx={{
                    gap: 1,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "bold",
                    }}
                >
                    {teeTimeString}
                </Typography>
                <Box margin="auto">
                    <Box
                        component="span"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0.2,
                        }}
                    >
                        <Group fontSize="small" />{" "}
                        <Typography component="span">
                            {playersDisplay}
                        </Typography>
                        <Typography>/</Typography>
                        <Flag fontSize="small" />{" "}
                        <Typography component="span">{holesDisplay}</Typography>
                    </Box>
                </Box>

                <Typography variant="body1">{priceDisplay}</Typography>

                <Button
                    sx={{ textTransform: "uppercase" }}
                    fullWidth
                    size="small"
                    variant="outlined"
                    target="_blank"
                    href={teeTime.link}
                >
                    Choose Rate
                </Button>
            </Stack>
        </Card>
    );
}
