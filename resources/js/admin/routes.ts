import React from "react";

import { CreateCourse } from "./pages/courses/create";
import { Courses } from "./pages/courses/Index";
import { UpdateCourse } from "./pages/courses/update";

export interface PageRoute {
    path: string;
    component: React.FunctionComponent;
}

export const paths = {
    courses: {
        index: "/admin/courses",
        create: "/admin/courses/create",
        update: (courseId?: string) =>
            `/admin/courses/${courseId || ":courseId"}`,
    },
};

export const routes: PageRoute[] = [
    {
        path: paths.courses.index,
        component: Courses,
    },
    {
        path: paths.courses.create,
        component: CreateCourse,
    },
    {
        path: paths.courses.update(),
        component: UpdateCourse,
    },
];
