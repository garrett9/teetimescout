import { useEffect, useState } from "react";

import axios from "axios";

import { useUserPreferences } from "../providers/UserPreferences";
import { ApiResponse } from "../types/api";
import { NearbyCourse } from "../types/Course";

const DEFAULT_WITHIN_MINUTES = 30;

export function useFindCourses() {
    const { userPreferences, client } = useUserPreferences();
    const [displayableCourses, setDisplayableCourses] =
        useState<NearbyCourse[]>();

    useEffect(() => {
        if (!userPreferences.address) {
            return;
        }

        if (
            !userPreferences.address.latitude ||
            !userPreferences.address.longitude
        ) {
            setDisplayableCourses([]);
            return;
        }

        axios
            .get<
                ApiResponse<NearbyCourse[]>
            >(`/api/courses/nearby?travel_minutes=${userPreferences.withinMinutes || DEFAULT_WITHIN_MINUTES}&latitude=${userPreferences.address.latitude}&longitude=${userPreferences.address.longitude}`)
            .then(({ data: { data } }) => {
                setDisplayableCourses(data);

                const mappedCousrseIds = Object.fromEntries(
                    data.map((course) => [course.slug, true]),
                );
                client.save((current) => {
                    return {
                        courseIds: {
                            ...mappedCousrseIds,
                            ...current.courseIds,
                        },
                    };
                });
            });
    }, [userPreferences.address, userPreferences.withinMinutes, client]);

    return displayableCourses;
}
