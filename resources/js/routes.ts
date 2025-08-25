import React from "react";

import { Contact } from "./pages/Contact";
import { Course } from "./pages/Course";
import { Courses } from "./pages/Courses";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { RequestCourse } from "./pages/RequestCourse";

export interface PageRoute {
    path: string;
    component: React.FunctionComponent;
    title?: string;
    description?: string;
}

export const paths = {
    home: "/",
    login: "/login",
    courses: "/courses",
    course: (slug?: string) => `/courses/${slug || ":slug"}`,
    contact: "/contact",
    requestCourse: "/request-course",
};

export const routes: PageRoute[] = [
    {
        path: paths.home,
        component: Home,
    },
    {
        path: paths.login,
        component: Login,
    },
    {
        path: paths.courses,
        component: Courses,
    },
    {
        path: paths.course(),
        component: Course,
    },
    {
        path: paths.requestCourse,
        component: RequestCourse,
        title: "Request a Course | Tee Time Scout",
        description: "Didn’t find your course? Request it here.",
    },
    {
        path: paths.contact,
        component: Contact,
        title: "Contact Us | Tee Time Scout",
        description:
            "Get in touch with Tee Time Scout for support and inquiries.",
    },
];
