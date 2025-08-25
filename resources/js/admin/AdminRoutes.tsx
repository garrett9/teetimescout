import { Navigate, Route, Routes } from "react-router";

import { paths, routes } from "./routes";

export function AdminRoutes() {
    return (
        <Routes>
            {routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    Component={route.component}
                />
            ))}
            <Route path="*" element={<Navigate to={paths.courses.index} />} />
        </Routes>
    );
}
