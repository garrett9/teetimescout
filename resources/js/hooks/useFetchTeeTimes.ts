import { useCallback } from "react";

import axios from "axios";
import { format } from "date-fns";

import { ApiResponse } from "../types/api";
import { TeeTime } from "../types/TeeTime";

export function useFetchTeeTimes() {
    return useCallback(
        async (courseIds: string[], date: Date): Promise<TeeTime[]> => {
            const courseIdQuery = courseIds
                .map((id) => `ids[]=${id}`)
                .join("&");
            const {
                data: { data },
            } = await axios.get<ApiResponse<TeeTime[]>>(
                `/api/tee-times?${courseIdQuery}&date=${format(date, "yyyy-MM-dd")}`,
            );
            return data;
        },
        [],
    );
}
