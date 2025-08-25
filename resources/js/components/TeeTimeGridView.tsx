import { useMemo } from "react";

import { Box } from "@mui/material";

import { TeeTime as TeeTimeType } from "../types/TeeTime";
import { TeeTime } from "./TeeTime";

interface TeeTimeGridViewProps {
    teeTimes: TeeTimeType[];
}

export function TeeTimeGridView({ teeTimes }: TeeTimeGridViewProps) {
    const times = useMemo(
        () =>
            teeTimes.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            }),
        [teeTimes],
    );

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, 240px)"
            gap={3}
            justifyContent="center"
        >
            {times.map((teeTime) => (
                <TeeTime teeTime={teeTime} key={teeTime.time} />
            ))}
        </Box>
    );
}
