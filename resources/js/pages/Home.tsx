import { useCallback, useEffect, useMemo, useState } from "react";

import { NavigateNext } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Drawer,
    MenuItem,
    Stack,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addDays, format, getHours, parseISO } from "date-fns";

import { AddressAutocomplete } from "../components/AddressAutocomplete";
import { AppDrawer } from "../components/AppDrawer";
import { AppMenu } from "../components/AppMenu";
import { TeeTimeTableView } from "../components/TeeTimeTableView";
import { useFetchTeeTimes } from "../hooks/useFetchTeeTimes";
import { useFindAddress } from "../hooks/useFindAddress";
import { useFindCourses } from "../hooks/useFindCourses";
import { SortBy, useUserPreferences } from "../providers/UserPreferences";
import { NearbyCourse } from "../types/Course";
import { TeeTime as TeeTimeType } from "../types/TeeTime";

const DRAWER_WIDTH = 350;
const STARTING_AT_DEFAULT = 6;

export function Home() {
    const address = useFindAddress();
    const fetchTeeTimes = useFetchTeeTimes();
    const courses = useFindCourses();
    const [displayedCourses, setDisplayedCourses] = useState<NearbyCourse[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [rawTeeTimes, setRawTeeTimes] = useState<TeeTimeType[]>([]);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { userPreferences, sessionPreferences, client } =
        useUserPreferences();

    const handleDrawerClose = useCallback(() => {
        setIsClosing(true);
        setMobileOpen(false);
    }, [setIsClosing, setMobileOpen]);

    const handleDrawerTransitionEnd = useCallback(() => {
        setIsClosing(false);
    }, [setIsClosing]);

    const handleDrawerToggle = useCallback(() => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    }, [isClosing, setMobileOpen, mobileOpen]);

    useEffect(() => {
        if (courses === undefined) {
            // Courses are still loading, so wait for them
            return;
        }

        const fitleredCourses = courses?.filter(
            (course) => userPreferences.courseIds?.[course.slug] !== false,
        );

        if (fitleredCourses.length <= 0) {
            setIsLoading(false);
            setRawTeeTimes([]);
            return;
        }

        setIsLoading(true);

        fetchTeeTimes(
            fitleredCourses.map((course) => course.slug),
            sessionPreferences.date
                ? new Date(sessionPreferences.date)
                : new Date(),
        )
            .then((results) => {
                const allTeeTimes = results;
                setRawTeeTimes(allTeeTimes);
                setDisplayedCourses(
                    courses.filter(
                        (course) =>
                            userPreferences.courseIds?.[course.slug] !== false,
                    ),
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [
        courses,
        userPreferences.courseIds,
        fetchTeeTimes,
        setRawTeeTimes,
        sessionPreferences.date,
        setIsLoading,
    ]);

    const filteredTeeTimes = useMemo(() => {
        return rawTeeTimes
            .filter((teeTime) => {
                return userPreferences.courseIds?.[teeTime.course_id] !== false;
            })
            .filter((teeTime) => {
                const teeTimeHour = getHours(parseISO(teeTime.time));
                return (
                    teeTimeHour >=
                    (sessionPreferences.startingAt || STARTING_AT_DEFAULT)
                );
            });
    }, [sessionPreferences.startingAt, rawTeeTimes, userPreferences.courseIds]);

    useEffect(() => {
        setMobileOpen(false);
    }, [
        sessionPreferences.date,
        userPreferences.address,
        userPreferences.withinMinutes,
        userPreferences.courseIds,
    ]);

    return (
        <Box sx={{ display: "flex" }}>
            <AppMenu
                onAppMenuClick={handleDrawerToggle}
                drawerWidth={DRAWER_WIDTH}
            />
            <Box
                component="nav"
                sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: "75%",
                        },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true, // Better open performance on mobile.
                        },
                    }}
                >
                    <AppDrawer
                        courses={courses}
                        address={address}
                        startingAtDefault={STARTING_AT_DEFAULT}
                    />
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: DRAWER_WIDTH,
                            zIndex: 200,
                            overflow: "auto",
                        },
                    }}
                    open
                >
                    <AppDrawer
                        courses={courses}
                        address={address}
                        startingAtDefault={STARTING_AT_DEFAULT}
                    />
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { xs: 1, md: `calc(100% - ${DRAWER_WIDTH}px)` },
                }}
            >
                <Toolbar />
                {isLoading && (
                    <Box sx={{ textAlign: "center", pt: 4 }}>
                        <CircularProgress color="success" size="3rem" />
                    </Box>
                )}
                {!isLoading && filteredTeeTimes.length > 0 && (
                    <TeeTimeTableView
                        teeTimes={filteredTeeTimes}
                        courses={displayedCourses || []}
                        referenceCoordinates={{
                            latitude: userPreferences.address?.latitude,
                            longitude: userPreferences.address?.longitude,
                        }}
                        startingAt={sessionPreferences.startingAt}
                        sortBy={userPreferences.sortBy}
                        header={
                            <Stack
                                direction={{ xs: "column", lg: "row" }}
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box sx={{ width: { xs: "100%", lg: "40%" } }}>
                                    <AddressAutocomplete
                                        value={userPreferences.address}
                                        onChange={(newAddress) => {
                                            client.save({
                                                address: newAddress,
                                            });
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        minWidth: 300,
                                        width: { xs: "100%", lg: "auto" },
                                    }}
                                >
                                    <TextField
                                        value={
                                            userPreferences.sortBy || "distance"
                                        }
                                        onChange={(e) =>
                                            client.save({
                                                sortBy: e.target
                                                    .value as SortBy,
                                            })
                                        }
                                        select
                                        label="Sort By"
                                    >
                                        <MenuItem value="distance">
                                            Distance
                                        </MenuItem>
                                        <MenuItem value="name">Name</MenuItem>
                                    </TextField>
                                </Box>
                            </Stack>
                        }
                    />
                )}
                {!isLoading && filteredTeeTimes.length <= 0 && (
                    <Card>
                        <CardContent
                            sx={{
                                maxWidth: "sm",
                                m: "auto",
                                textAlign: "center",
                            }}
                        >
                            <Stack>
                                <Typography variant="h6">
                                    No tee times found for{" "}
                                    {format(
                                        sessionPreferences.date
                                            ? new Date(sessionPreferences.date)
                                            : new Date(),
                                        "EEEE, LLL do",
                                    )}
                                </Typography>
                                <Typography>
                                    Try adjusting your filters or searching a
                                    different date
                                </Typography>
                                <AddressAutocomplete
                                    value={userPreferences.address}
                                    onChange={(newAddress) => {
                                        client.save({
                                            address: newAddress,
                                        });
                                    }}
                                />
                                <DatePicker
                                    label="Date"
                                    value={
                                        sessionPreferences.date
                                            ? new Date(sessionPreferences.date)
                                            : new Date()
                                    }
                                    minDate={new Date()}
                                    onChange={(newDate) => {
                                        client.saveSession({
                                            date: newDate?.toISOString(),
                                        });
                                    }}
                                />
                                <Box>
                                    <Button
                                        variant="outlined"
                                        type="button"
                                        onClick={() => {
                                            client.saveSession({
                                                date: addDays(
                                                    sessionPreferences.date
                                                        ? new Date(
                                                              sessionPreferences.date,
                                                          )
                                                        : new Date(),
                                                    1,
                                                ).toISOString(),
                                            });
                                        }}
                                    >
                                        Next Day <NavigateNext />
                                    </Button>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
}
