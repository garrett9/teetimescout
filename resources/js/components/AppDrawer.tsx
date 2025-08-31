import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

import {
    Close,
    FilterAltOutlined,
    NavigateNext,
    Today,
} from "@mui/icons-material";
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Skeleton,
    Slider,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addDays, format, isSameDay, setHours, setMinutes } from "date-fns";
import { debounce } from "lodash";

import { Address, useUserPreferences } from "../providers/UserPreferences";
import { NearbyCourse } from "../types/Course";

interface AppDrawerProps {
    address?: Address;
    courses?: NearbyCourse[];
    startingAtDefault: number;
    onClose?: () => void;
}

const valueLabelFormat = (value: number) => {
    return format(setHours(setMinutes(new Date(), 0), value), "p");
};

export function AppDrawer({
    address,
    courses,
    startingAtDefault,
    onClose,
}: AppDrawerProps) {
    const { userPreferences, sessionPreferences, client } =
        useUserPreferences();
    const [startingAt, setStartingAt] = useState<number>(
        sessionPreferences.startingAt || startingAtDefault,
    );
    const [localCourseIds, setLocalCourseIds] = useState<
        Record<string, boolean>
    >(userPreferences.courseIds || {});
    useEffect(() => {
        setLocalCourseIds(userPreferences.courseIds || {});
    }, [userPreferences.courseIds]);
    const debouncedSaveCourseIds = useMemo(
        () =>
            debounce((updatedCourseIds: Record<string, boolean>) => {
                client.save({ courseIds: updatedCourseIds });
            }, 1500),
        [client],
    );

    const isLoading = address === undefined || courses === undefined;

    const sortedCourses = useMemo(
        () => courses?.sort((a, b) => a.name.localeCompare(b.name)),
        [courses],
    );

    const allCoursesSelected = useMemo(
        () => sortedCourses?.every((course) => localCourseIds[course.slug]),
        [sortedCourses, localCourseIds],
    );

    const toggleSelectAll = useCallback(() => {
        const newCourseIds: Record<string, boolean> = {
            ...localCourseIds,
        };
        Object.keys(newCourseIds).forEach((slug) => {
            newCourseIds[slug] = !allCoursesSelected;
        });

        setLocalCourseIds(newCourseIds);
        debouncedSaveCourseIds(newCourseIds);
    }, [allCoursesSelected, debouncedSaveCourseIds, localCourseIds]);

    return (
        <div>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    bgcolor: "white",
                    zIndex: 100,
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack spacing={0} direction="row" alignItems="center">
                        <FilterAltOutlined fontSize="medium" />{" "}
                        <Typography variant="h6" component="div">
                            Filters
                        </Typography>
                    </Stack>
                    <IconButton size="small" onClick={onClose}>
                        <Close />
                    </IconButton>
                </Toolbar>
                <Divider />
            </Box>
            <Box sx={{ p: 3.5 }}>
                {isLoading && (
                    <Stack spacing={1}>
                        <Skeleton width="100%" height="50px" />
                        <Skeleton width="100%" height="50px" />
                        <Skeleton width="100%" height="50px" />
                        <Skeleton width="100%" height="50px" />
                    </Stack>
                )}
                {!isLoading && (
                    <Stack spacing={1}>
                        <Stack>
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
                            <ButtonGroup variant="outlined" fullWidth>
                                <Button
                                    onClick={() => {
                                        client.saveSession({
                                            date: new Date().toISOString(),
                                        });
                                    }}
                                    disabled={
                                        !sessionPreferences.date ||
                                        isSameDay(
                                            new Date(),
                                            new Date(sessionPreferences.date),
                                        )
                                    }
                                >
                                    Today{" "}
                                    <Today
                                        sx={{
                                            ml: 1,
                                        }}
                                    />
                                </Button>
                                <Button
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
                                    Next Day
                                    <NavigateNext />
                                </Button>
                            </ButtonGroup>
                        </Stack>
                        <FormControl fullWidth>
                            <InputLabel id="distance">Distance</InputLabel>
                            <Select
                                labelId="distance"
                                label="Distance"
                                value={userPreferences.withinMinutes || 30}
                                onChange={(e) => {
                                    client.save({
                                        withinMinutes: e.target.value,
                                    });
                                }}
                            >
                                <MenuItem value={15}>15 min</MenuItem>
                                <MenuItem value={20}>20 min</MenuItem>
                                <MenuItem value={30}>30 min</MenuItem>
                                <MenuItem value={45}>45 min</MenuItem>
                                <MenuItem value={60}>1 h</MenuItem>
                                <MenuItem value={90}>1 hr 30 min</MenuItem>
                                <MenuItem value={120}>2 hr</MenuItem>
                            </Select>
                        </FormControl>
                        <FormGroup>
                            <InputLabel size="medium">
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0}
                                >
                                    <span>Courses</span>
                                    <FormControlLabel
                                        label={
                                            allCoursesSelected
                                                ? "Deselect All"
                                                : "Select All"
                                        }
                                        checked={allCoursesSelected}
                                        control={
                                            <Checkbox
                                                size="small"
                                                onChange={toggleSelectAll}
                                            />
                                        }
                                    />
                                </Stack>
                            </InputLabel>
                            {courses?.length <= 0 && (
                                <Typography color="error">
                                    No courses found
                                </Typography>
                            )}
                            {sortedCourses && sortedCourses.length > 0 && (
                                <Stack
                                    sx={{
                                        gap: 1,
                                    }}
                                >
                                    {sortedCourses.map((course) => (
                                        <FormControlLabel
                                            key={course.slug}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={
                                                        localCourseIds[
                                                            course.slug
                                                        ] || false
                                                    }
                                                    onChange={(
                                                        e: ChangeEvent<HTMLInputElement>,
                                                    ) => {
                                                        const courseIds = {
                                                            ...localCourseIds,
                                                            [course.slug]:
                                                                e.target
                                                                    .checked,
                                                        };
                                                        setLocalCourseIds(
                                                            courseIds,
                                                        );
                                                        debouncedSaveCourseIds(
                                                            courseIds,
                                                        );
                                                    }}
                                                />
                                            }
                                            label={course.name}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </FormGroup>
                        <FormGroup sx={{ width: "90%" }}>
                            <InputLabel size="medium">Starting At</InputLabel>
                            <Slider
                                sx={{
                                    ml: 2,
                                }}
                                value={startingAt}
                                step={1}
                                min={6}
                                max={18}
                                marks={[
                                    {
                                        value: 6,
                                        label: "6:00am",
                                    },
                                    {
                                        value: 18,
                                        label: "6:00pm",
                                    },
                                ]}
                                onChange={(e, newValue: number) => {
                                    setStartingAt(newValue);
                                }}
                                onChangeCommitted={(e, newValue: number) => {
                                    client.saveSession({
                                        startingAt: newValue,
                                    });
                                }}
                                getAriaValueText={valueLabelFormat}
                                valueLabelFormat={valueLabelFormat}
                                valueLabelDisplay="auto"
                                disableSwap
                            />
                        </FormGroup>
                    </Stack>
                )}
            </Box>
        </div>
    );
}
