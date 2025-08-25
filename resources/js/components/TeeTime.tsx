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
                width: 240,
                p: 2,
            }}
        >
            <Stack spacing={0}>
                <Stack
                    justifyContent="space-between"
                    alignContent="center"
                    direction="row"
                >
                    <Typography
                        fontSize={14}
                        fontWeight="bold"
                        color="textSecondary"
                    >
                        {teeTimeString}
                    </Typography>
                    <Typography
                        fontSize={14}
                        fontWeight="bold"
                        color="textSecondary"
                    >
                        <Box
                            component="span"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignContent: "center",
                            }}
                        >
                            <Group />{" "}
                            <Typography sx={{ pl: 1 }} component="span">
                                {playersDisplay}
                            </Typography>
                            <Flag sx={{ pl: 1 }} />{" "}
                            <Typography component="span">
                                {holesDisplay}
                            </Typography>
                        </Box>
                    </Typography>
                </Stack>
                <Box textAlign="center">
                    <Typography>{teeTime.name}</Typography>
                    <Typography
                        fontSize={18}
                        sx={{ pt: 1, fontWeight: "bold" }}
                        variant="body1"
                    >
                        {priceDisplay}
                    </Typography>
                </Box>
                <Button
                    sx={{ textTransform: "uppercase" }}
                    fullWidth
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
