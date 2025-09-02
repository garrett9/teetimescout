import React, {
    MutableRefObject,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";

import { DirectionsCar, Map, NavigateNext } from "@mui/icons-material";
import {
    Button,
    Card,
    CardHeader,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import { difference, groupBy, keyBy, maxBy, minBy } from "lodash";
import { useDraggable } from "react-use-draggable-scroll";

import { SortBy } from "../providers/UserPreferences";
import { NearbyCourse } from "../types/Course";
import { TeeTime as TeeTimeType } from "../types/TeeTime";
import { TeeTime } from "./TeeTime";

interface TeeTimeTableViewProps {
    courses: NearbyCourse[];
    teeTimes: TeeTimeType[];
    header?: ReactNode;
    referenceCoordinates?: {
        latitude?: number;
        longitude?: number;
    };
    sortBy?: SortBy;
    startingAt?: number;
}

const INTERVAL_MINUTES = 30;
const now = new Date();
const stepMs = INTERVAL_MINUTES * 60 * 1000;

function floorToIntervalISO(date: Date): string {
    const floored = Math.floor(date.getTime() / stepMs) * stepMs;
    return new Date(floored).toISOString();
}

export function TeeTimeTableView({
    teeTimes,
    courses,
    header,
    sortBy,
    referenceCoordinates,
    startingAt,
}: TeeTimeTableViewProps) {
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const { events } = useDraggable(
        tableContainerRef as MutableRefObject<HTMLElement>,
    );

    const columnRefs = useRef<Record<string, HTMLTableCellElement | null>>(
        Object.create(null),
    );

    const directionsLinkGenerator = useCallback(
        (course: NearbyCourse, travelMinutes: number): string => {
            const destination = [course.latitude, course.longitude].join(",");

            if (travelMinutes <= 0) {
                return `https://www.google.com/maps/place/${destination}/@${destination},11z`;
            }

            const origin = [
                referenceCoordinates?.latitude,
                referenceCoordinates?.longitude,
            ].join(",");

            return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        },
        [referenceCoordinates],
    );

    const maxTeeTime = useMemo(
        () =>
            maxBy(teeTimes, (teeTime) => new Date(teeTime.time).getTime())
                ?.time || now,
        [teeTimes],
    );

    const minTeeTime = useMemo(
        () =>
            minBy(teeTimes, (teeTime) => new Date(teeTime.time).getTime())
                ?.time || now,
        [teeTimes],
    );

    const { groupedTimes, scrollButtons, timeKeys } = useMemo(() => {
        const groups = groupBy(teeTimes, "name");
        const groupCourseNames = Object.keys(groups);
        const allCourseNames = courses.map((course) => course.name);
        const nameDifferences = difference(allCourseNames, groupCourseNames);

        nameDifferences.forEach((name) => {
            groups[name] = [];
        });

        const startMs =
            Math.floor(new Date(minTeeTime).getTime() / stepMs) * stepMs;
        const endMs = new Date(maxTeeTime).getTime();

        const localTimeKeys: string[] = [];
        for (let time = startMs; time <= endMs; time += stepMs) {
            localTimeKeys.push(new Date(time).toISOString());
        }

        const initialGrouped = Object.fromEntries(
            Object.entries(groups).map(([name, times]) => {
                const grouped: Record<string, TeeTimeType[]> = {};
                localTimeKeys.forEach((key) => {
                    grouped[key] = [];
                });

                times.forEach((teeTime) => {
                    const key = floorToIntervalISO(new Date(teeTime.time));
                    if (grouped[key]) {
                        grouped[key].push(teeTime);
                    }
                });

                return [name, grouped];
            }),
        );

        // Keep only timeKeys where at least one group has tee times
        const localFilteredTimeKeys = localTimeKeys.filter((key) =>
            Object.values(initialGrouped).some((group) => group[key]?.length),
        );

        const finalGrouped: Record<
            string,
            Record<string, TeeTimeType[]>
        > = Object.fromEntries(
            Object.entries(initialGrouped).map(([name, group]) => {
                const filteredGroup: Record<string, TeeTimeType[]> = {};
                localFilteredTimeKeys.forEach((key) => {
                    filteredGroup[key] = group[key];
                });
                return [name, filteredGroup];
            }),
        );

        const localScrollButtons: Record<string, Set<string>> = {};
        Object.entries(finalGrouped).forEach(([name, group]) => {
            const runStarts = new Set<string>();
            let inRun = false;

            Object.entries(group).forEach(([key, localTeeTimes]) => {
                if (localTeeTimes.length === 0) {
                    if (!inRun) {
                        // This is the first empty in a run
                        runStarts.add(key);
                        inRun = true;
                    }
                } else {
                    inRun = false;
                }
            });

            localScrollButtons[name] = runStarts;
        });

        return {
            groupedTimes: finalGrouped,
            scrollButtons: localScrollButtons,
            timeKeys: localFilteredTimeKeys,
        };
    }, [teeTimes, maxTeeTime, minTeeTime, courses]);

    const courseMap = useMemo(() => keyBy(courses, "name"), [courses]);

    const handleScrollTo = useCallback((key: string) => {
        const cell = columnRefs.current[key];
        const container = tableContainerRef.current;

        if (cell && container) {
            // cell position relative to container
            const cellRect = cell.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // left distance of cell inside the scroll container
            const leftOffset =
                cellRect.left - containerRect.left + container.scrollLeft;

            container.scrollTo({
                left: leftOffset,
                behavior: "smooth",
            });
        }
    }, []);

    useEffect(() => {
        tableContainerRef.current?.scrollTo({
            left: 0,
        });
    }, [startingAt]);

    const findNextAvailableTimeKeyForCourse = useCallback(
        (currentKey: string, courseName: string): string | null => {
            const index = timeKeys.indexOf(currentKey);
            if (index === -1) return null;

            const group = groupedTimes[courseName];
            for (let i = index + 1; i < timeKeys.length; i += 1) {
                const key = timeKeys[i];
                if (group[key]?.length) {
                    return key;
                }
            }
            return null;
        },
        [groupedTimes, timeKeys],
    );

    const sortedGroupedTimes = useMemo(() => {
        return Object.entries(groupedTimes).sort(([a], [b]) => {
            if (!sortBy || sortBy === "distance") {
                return (
                    courseMap[a].travel_minutes - courseMap[b].travel_minutes
                );
            }

            return a.localeCompare(b);
        });
    }, [sortBy, courseMap, groupedTimes]);

    return (
        <Card sx={{ boxShadow: 2 }}>
            {header && (
                <CardHeader
                    sx={{
                        px: 2,
                        pt: 2,
                    }}
                    title={
                        <>
                            {header}
                            <Divider
                                sx={{
                                    my: 1,
                                }}
                            />
                        </>
                    }
                />
            )}
            <TableContainer
                {...events}
                ref={tableContainerRef}
                sx={{ cursor: "grab" }}
            >
                <Table sx={{ borderCollapse: "separate" }}>
                    <TableBody>
                        {sortedGroupedTimes.map(
                            ([name, groupedTimesByInterval]) => (
                                <React.Fragment key={name}>
                                    <TableRow>
                                        <TableCell
                                            colSpan={
                                                Object.keys(
                                                    groupedTimesByInterval,
                                                ).length
                                            }
                                            sx={{
                                                position: "sticky",
                                                left: 0,
                                                top: "auto",
                                                zIndex: 2,
                                                lineHeight: 0.75,
                                                paddingTop: 1,
                                                paddingBottom: 1,
                                                borderBottom: 0,
                                            }}
                                        >
                                            <Stack
                                                spacing={0}
                                                direction={{
                                                    xs: "column",
                                                    md: "row",
                                                }}
                                                alignItems={{
                                                    xs: "left",
                                                    md: "center",
                                                }}
                                                sx={{
                                                    gap: 1,
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        maxWidth: {
                                                            xs: 400,
                                                            sm: 500,
                                                            md: 1400,
                                                        },
                                                    }}
                                                >
                                                    {name}
                                                </Typography>

                                                <Typography
                                                    href={directionsLinkGenerator(
                                                        courseMap[name],
                                                        courseMap[name]
                                                            .travel_minutes,
                                                    )}
                                                    target="_blank"
                                                    component="a"
                                                    fontSize="small"
                                                >
                                                    {courseMap[name]
                                                        .travel_minutes > 0 && (
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={0}
                                                        >
                                                            <DirectionsCar />
                                                            <span>
                                                                {
                                                                    courseMap[
                                                                        name
                                                                    ]
                                                                        .travel_minutes
                                                                }{" "}
                                                                minute
                                                                {courseMap[name]
                                                                    .travel_minutes !==
                                                                1
                                                                    ? "s"
                                                                    : ""}{" "}
                                                                away
                                                            </span>
                                                        </Stack>
                                                    )}
                                                    {courseMap[name]
                                                        .travel_minutes <=
                                                        0 && (
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={0}
                                                        >
                                                            <Map />
                                                            <span>
                                                                Location
                                                            </span>
                                                        </Stack>
                                                    )}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        {Object.entries(
                                            groupedTimesByInterval,
                                        ).map(([time]) => {
                                            const startTime = new Date(time);
                                            const endTime = new Date(
                                                startTime.getTime() + stepMs,
                                            );
                                            return (
                                                <TableCell
                                                    key={time}
                                                    ref={(
                                                        el: HTMLTableCellElement,
                                                    ) => {
                                                        columnRefs.current[
                                                            time
                                                        ] = el;
                                                    }}
                                                    sx={{
                                                        position: "sticky",
                                                        whiteSpace: "nowrap",
                                                        left: -1,
                                                        zIndex: 2,
                                                        backgroundColor: "#fff",
                                                        lineHeight: 0.25,
                                                        borderLeft: 1,
                                                        borderTop: 1,
                                                        borderColor: "divider",
                                                        fontWeight: "bold",
                                                        "&:first-of-type": {
                                                            borderLeft: 0,
                                                            left: 0,
                                                        },
                                                    }}
                                                >
                                                    {startTime.toLocaleTimeString(
                                                        "en-US",
                                                        {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        },
                                                    )}{" "}
                                                    -{" "}
                                                    {endTime.toLocaleTimeString(
                                                        "en-US",
                                                        {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        },
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                    <TableRow>
                                        {Object.entries(
                                            groupedTimesByInterval,
                                        ).map(([time, teeTimesInInterval]) => {
                                            const nextAvailableTime =
                                                findNextAvailableTimeKeyForCourse(
                                                    time,
                                                    name,
                                                );

                                            const isRunStart =
                                                scrollButtons[name]?.has(time);

                                            return (
                                                <TableCell
                                                    key={time}
                                                    sx={{
                                                        textAlign: "center",
                                                        backgroundColor:
                                                            "#f9f9f9",
                                                        zIndex: 4,
                                                        position: "relative",
                                                        ...(isRunStart
                                                            ? {
                                                                  position:
                                                                      "sticky",
                                                                  left: 0,
                                                                  zIndex: 3,
                                                              }
                                                            : {}),
                                                        ...(!isRunStart &&
                                                        teeTimesInInterval.length <=
                                                            0
                                                            ? {
                                                                  zIndex: 2,
                                                              }
                                                            : {}),
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                        justifyContent="left"
                                                    >
                                                        {teeTimesInInterval.map(
                                                            (
                                                                teeTimeInInterval,
                                                            ) => (
                                                                <TeeTime
                                                                    key={
                                                                        teeTimeInInterval.time
                                                                    }
                                                                    teeTime={
                                                                        teeTimeInInterval
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                        {isRunStart &&
                                                            (nextAvailableTime ? (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        bgcolor:
                                                                            "white",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleScrollTo(
                                                                            nextAvailableTime,
                                                                        )
                                                                    }
                                                                >
                                                                    Scroll to
                                                                    next time{" "}
                                                                    <NavigateNext />
                                                                </Button>
                                                            ) : (
                                                                <Typography
                                                                    variant="h5"
                                                                    color="text.secondary"
                                                                >
                                                                    No further
                                                                    tee times
                                                                </Typography>
                                                            ))}
                                                    </Stack>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                </React.Fragment>
                            ),
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}
