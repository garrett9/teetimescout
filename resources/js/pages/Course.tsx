import { useEffect, useMemo, useState } from "react";

import { NavigateNext, Today } from "@mui/icons-material";
import {
    Box,
    Breadcrumbs,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { addDays, format, isSameDay, isValid, parse } from "date-fns";
import { partition } from "lodash";
import {
    Link as RouterLink,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router";

import { AppContainer } from "../components/AppContainer";
import { TeeTimeTableView } from "../components/TeeTimeTableView";
import { useFetchTeeTimes } from "../hooks/useFetchTeeTimes";
import { useUserPreferences } from "../providers/UserPreferences";
import { paths } from "../routes";
import { ApiResponse } from "../types/api";
import { Course as CourseType, NearbyCourse } from "../types/Course";
import { TeeTime, TeeTime as TeeTimeType } from "../types/TeeTime";

export function Course() {
    const route = useParams<{
        slug: string;
    }>();
    const [course, setCourse] = useState<CourseType>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [rawTeeTimes, setRawTeeTimes] = useState<TeeTimeType[]>([]);
    const fetchTeeTimes = useFetchTeeTimes();
    const [displayedCourses, setDisplayedCourses] = useState<NearbyCourse[]>();
    const [searchParams, setSearchParams] = useSearchParams();
    const rawDate = searchParams.get("date");
    const { userPreferences, client } = useUserPreferences();

    const date = useMemo(() => {
        if (rawDate) {
            // Try parsing (expects "Y-m-d" = "yyyy-MM-dd")
            const parsed = parse(rawDate, "yyyy-MM-dd", new Date());
            if (isValid(parsed)) {
                return parsed; // ✅ Return Date instance
            }
        }

        // Fallback to current date
        return new Date();
    }, [rawDate]);

    useEffect(() => {
        if (!route.slug) {
            navigate(paths.courses);
            return;
        }

        setIsLoading(true);

        axios
            .get<ApiResponse<CourseType>>(`/api/courses/${route.slug}`)
            .then(async (response) => {
                const courseResponse = response.data.data;
                setCourse(courseResponse);

                return axios.get<ApiResponse<NearbyCourse[]>>(
                    `/api/courses/nearby?travel_minutes=20&latitude=${courseResponse.latitude}&longitude=${courseResponse.longitude}`,
                );
            })
            .then(({ data: { data } }) => {
                setDisplayedCourses(
                    data.filter(
                        (nearbyCourse) => nearbyCourse.slug !== route.slug,
                    ),
                );
                return fetchTeeTimes(
                    data.map((nearbyCourse) => nearbyCourse.slug),
                    date,
                );
            })
            .then((results) => {
                const allTeeTimes = results;
                setRawTeeTimes(allTeeTimes);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [fetchTeeTimes, navigate, route.slug, date]);

    const [courseTeeTimes, nearbyCourseTeeTimes] = useMemo(() => {
        return partition(
            rawTeeTimes,
            (teeTime: TeeTime) => teeTime.course_id === course?.course_id,
        );
    }, [rawTeeTimes, course?.course_id]);

    return (
        <AppContainer>
            {course && (
                <>
                    <title>{`${course.name} Tee Times`}</title>
                    <meta
                        name="description"
                        content={`Discover the best tee time at ${course.name} and nearby courses.`}
                    />
                </>
            )}
            <Stack>
                {isLoading && (
                    <Box sx={{ textAlign: "center", pt: 4 }}>
                        <CircularProgress color="success" size="3rem" />
                    </Box>
                )}
                {!isLoading && course && (
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            component={RouterLink}
                            to={paths.courses}
                        >
                            Course Directory
                        </Link>
                        <Typography sx={{ color: "text.primary" }}>
                            {course.name}
                        </Typography>
                    </Breadcrumbs>
                )}
                {!isLoading && course && courseTeeTimes.length > 0 && (
                    <TeeTimeTableView
                        teeTimes={courseTeeTimes}
                        courses={[
                            {
                                ...course,
                                travel_minutes: 0,
                            },
                        ]}
                        header={
                            <Stack direction="row" alignItems="center">
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    minDate={new Date()}
                                    onChange={(newDate) => {
                                        if (!newDate) {
                                            return;
                                        }

                                        setSearchParams({
                                            date: format(newDate, "yyyy-MM-dd"),
                                        });
                                    }}
                                />
                                <ButtonGroup variant="outlined">
                                    <Button
                                        onClick={() => {
                                            setSearchParams({
                                                date: format(
                                                    new Date(),
                                                    "yyyy-MM-dd",
                                                ),
                                            });
                                        }}
                                        disabled={isSameDay(new Date(), date)}
                                    >
                                        Today{" "}
                                        <Today
                                            sx={{
                                                ml: 1,
                                            }}
                                        />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        type="button"
                                        onClick={() => {
                                            setSearchParams({
                                                date: format(
                                                    addDays(date, 1),
                                                    "yyyy-MM-dd",
                                                ),
                                            });
                                        }}
                                    >
                                        Next Day <NavigateNext />
                                    </Button>
                                </ButtonGroup>
                            </Stack>
                        }
                    />
                )}
                {!isLoading && courseTeeTimes.length <= 0 && course && (
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
                                    {course.name}
                                </Typography>
                                <Divider />
                                <Typography variant="h6">
                                    No tee times found for{" "}
                                    {format(date, "EEEE, LLL do")}
                                </Typography>
                                <Typography>
                                    Try searching a different date
                                </Typography>
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    minDate={new Date()}
                                    onChange={(newDate) => {
                                        if (!newDate) {
                                            return;
                                        }

                                        setSearchParams({
                                            date: format(newDate, "yyyy-MM-dd"),
                                        });
                                    }}
                                />
                                <Box>
                                    <Button
                                        variant="outlined"
                                        type="button"
                                        onClick={() => {
                                            setSearchParams({
                                                date: format(
                                                    addDays(date, 1),
                                                    "yyyy-MM-dd",
                                                ),
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
                {!isLoading && course && nearbyCourseTeeTimes.length > 0 && (
                    <>
                        <Divider>Other Courses Near {course.name}</Divider>
                        <TeeTimeTableView
                            teeTimes={nearbyCourseTeeTimes}
                            courses={displayedCourses || []}
                            referenceCoordinates={{
                                latitude: course?.latitude,
                                longitude: course?.longitude,
                            }}
                        />
                    </>
                )}
            </Stack>
        </AppContainer>
    );
}
