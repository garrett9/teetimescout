import { TeeTimeService } from "./TeeTimeService";
import { USStateAbbreviation } from "./USStates";
import { USTimezone } from "./USTimezone";

export interface NearbyCourse {
    slug: string;
    name: string;
    travel_minutes: number;
    latitude: number;
    longitude: number;
}

export interface Course {
    course_id: string;
    slug: string;
    city: string;
    country: string;
    state: USStateAbbreviation;
    name: string;
    latitude: number;
    longitude: number;
    is_simulator: boolean;
}

export interface AdminCourse extends Course {
    timezone: USTimezone;
    tee_time_service: TeeTimeService;
    meta: Record<string, string>;
}
