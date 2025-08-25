import { useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { useNavigate } from "react-router";

import { useSubmit } from "../../../hooks/useSubmit";
import { NearbyCourse } from "../../../types/Course";
import { TeeTimeService } from "../../../types/TeeTimeService";
import {
    USStateAbbreviation,
    usStateAbbreviations,
} from "../../../types/USStates";
import { USTimezone, usTimezones } from "../../../types/USTimezone";
import { paths } from "../../routes";

interface CreateCoursePayload {
    course_id: string;
    name: string;
    timezone: USTimezone;
    city: string;
    state: USStateAbbreviation;
    latitude: string;
    longitude: string;
    tee_time_service: TeeTimeService;
    meta: Record<string, string>;
}

export function CreateCourse() {
    const navigate = useNavigate();
    const [course, setCourse] = useState<CreateCoursePayload>({
        course_id: "",
        timezone: "America/New_York",
        city: "",
        state: "NJ",
        latitude: "",
        longitude: "",
        name: "",
        meta: {},
        tee_time_service: "fore_up",
    });
    const { inProgress, submit, errors } = useSubmit<
        NearbyCourse,
        CreateCoursePayload
    >({
        path: "/api/courses",
        config: {
            method: "POST",
            data: course,
        },
        onSuccess: () => {
            navigate(paths.courses.index);
        },
    });

    return (
        <Card
            component="form"
            onSubmit={submit}
            sx={{
                maxWidth: "sm",
                mx: "auto",
            }}
        >
            <CardHeader title="Create a Course" />
            <Stack component={CardContent}>
                <TextField
                    required
                    type="text"
                    label="Course ID"
                    error={!!errors.course_id}
                    helperText={errors.course_id}
                    value={course.course_id}
                    onChange={(e) =>
                        setCourse({
                            ...course,
                            course_id: e.target.value,
                        })
                    }
                />
                <TextField
                    required
                    type="text"
                    label="Name"
                    error={!!errors.name}
                    helperText={errors.name}
                    value={course.name}
                    onChange={(e) =>
                        setCourse({
                            ...course,
                            name: e.target.value,
                        })
                    }
                />
                <FormControl fullWidth>
                    <InputLabel required id="timezone">
                        Timezone
                    </InputLabel>
                    <Select
                        required
                        error={!!errors.timezone}
                        labelId="timezone"
                        label="Timezone"
                        value={course.timezone}
                        onChange={(e) =>
                            setCourse({
                                ...course,
                                timezone: e.target.value,
                            })
                        }
                    >
                        {usTimezones.map((timezone) => (
                            <MenuItem value={timezone}>{timezone}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{errors.timezone}</FormHelperText>
                </FormControl>
                <TextField
                    required
                    type="text"
                    label="City"
                    error={!!errors.city}
                    helperText={errors.city}
                    value={course.city}
                    onChange={(e) =>
                        setCourse({
                            ...course,
                            city: e.target.value,
                        })
                    }
                />
                <FormControl fullWidth>
                    <InputLabel required id="state">
                        State
                    </InputLabel>
                    <Select
                        required
                        error={!!errors.state}
                        labelId="state"
                        label="State"
                        value={course.state}
                        onChange={(e) =>
                            setCourse({
                                ...course,
                                state: e.target.value,
                            })
                        }
                    >
                        {usStateAbbreviations.map((state) => (
                            <MenuItem value={state}>{state}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{errors.state}</FormHelperText>
                </FormControl>
                <TextField
                    required
                    type="string"
                    label="Latitude"
                    error={!!errors.latitude}
                    helperText={errors.latitude}
                    value={course.latitude}
                    onChange={(e) => {
                        const coordinates = e.target.value.split(",");
                        setCourse({
                            ...course,
                            latitude: e.target.value ? coordinates[0] : "",
                            longitude:
                                coordinates.length > 1
                                    ? coordinates[1]
                                    : course.longitude,
                        });
                    }}
                />
                <TextField
                    required
                    type="string"
                    label="Longitude"
                    error={!!errors.longitude}
                    helperText={errors.longitude}
                    value={course.longitude}
                    slotProps={{
                        inputLabel: {
                            shrink: !!course.longitude,
                        },
                    }}
                    onChange={(e) =>
                        setCourse({
                            ...course,
                            longitude: e.target.value,
                        })
                    }
                />
                <FormControl>
                    <InputLabel required id="teeTimeService">
                        Tee Time Service
                    </InputLabel>
                    <Select
                        required
                        error={!!errors.tee_time_service}
                        labelId="timezone"
                        label="Tee Time Service"
                        value={course.tee_time_service}
                        onChange={(e) => {
                            setCourse({
                                ...course,
                                tee_time_service: e.target.value,
                                meta:
                                    e.target.value !== course.tee_time_service
                                        ? {}
                                        : course.meta,
                            });
                        }}
                    >
                        <MenuItem value="fore_up">Fore Up</MenuItem>
                        <MenuItem value="golf_now">GolfNow</MenuItem>
                        <MenuItem value="tee_it_up">Tee It Up</MenuItem>
                    </Select>
                    <FormHelperText>{errors.tee_time_service}</FormHelperText>
                </FormControl>
                {course.tee_time_service === "fore_up" && (
                    <TextField
                        required
                        type="string"
                        label="Booking Class ID"
                        error={!!errors.meta?.booking_class_id}
                        helperText={errors.meta?.booking_class_id}
                        value={course.meta.booking_class_id || ""}
                        onChange={(e) =>
                            setCourse({
                                ...course,
                                meta: {
                                    ...course.meta,
                                    booking_class_id: e.target.value,
                                },
                            })
                        }
                    />
                )}
                <Box>
                    <Button type="submit" loading={inProgress}>
                        Create
                    </Button>
                </Box>
            </Stack>
        </Card>
    );
}
