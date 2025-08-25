import { Navigate, Route, Routes } from "react-router";

import { paths, routes } from "./routes";

const DEFAULT_TITLE = "Tee Time Scout | Find & Book Golf Tee Times Near You";

const DEFAULT_DESCRIPTION =
    "Find and book the best golf tee times near you with Tee Time Scout.";

export function AppRoutes() {
    return (
        <Routes>
            {routes.map(
                ({ path, component: Component, title, description }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <>
                                <title>{title || DEFAULT_TITLE}</title>
                                <meta
                                    name="description"
                                    content={description || DEFAULT_DESCRIPTION}
                                />
                                <Component />
                            </>
                        }
                    />
                ),
            )}
            <Route path="*" element={<Navigate to={paths.home} />} />
        </Routes>
    );
}
