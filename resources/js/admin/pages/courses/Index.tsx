import { useMemo, useState } from "react";

import { Add, MoreVert } from "@mui/icons-material";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import {
    DataGrid,
    getGridBooleanOperators,
    getGridStringOperators,
    GridColDef,
    GridDataSource,
    GridGetRowsParams,
    GridGetRowsResponse,
    useGridApiRef,
} from "@mui/x-data-grid";
import axios from "axios";
import { Link } from "react-router";

import { ApiPaginatedResponse } from "../../../types/api";
import { AdminCourse } from "../../../types/Course";
import { CourseMenu, CourseMenuInstance } from "../../components/CourseMenu";
import { paths } from "../../routes";

const dataSource: GridDataSource = {
    getRows: async (
        params: GridGetRowsParams,
    ): Promise<GridGetRowsResponse> => {
        const query = new URLSearchParams();

        query.set("page", ((params.paginationModel?.page ?? 0) + 1).toString());
        query.set(
            "page_size",
            (params.paginationModel?.pageSize ?? 25).toString(),
        );
        if (params.sortModel.length > 0) {
            query.set("sort_field", params.sortModel[0].field);
            query.set("sort_direction", params.sortModel[0].sort ?? "asc");
        }

        params.filterModel.items.forEach((filter) => {
            if (filter.value !== undefined) {
                if (typeof filter.value === "boolean") {
                    query.set(filter.field, filter.value ? "1" : "0");
                    return;
                }

                query.set(filter.field, filter.value ?? "");
            }
        });

        if (params.filterModel.quickFilterValues) {
            query.set("search", params.filterModel.quickFilterValues.join(" "));
        }

        try {
            const { data } = await axios.get<ApiPaginatedResponse<AdminCourse>>(
                `/api/courses?${query.toString()}`,
            );
            return {
                rows: data.data,
                rowCount: data.meta.total,
            };
        } catch (e) {
            console.error("Failed to fetch courses:", e);
        }

        return {
            rows: [],
            rowCount: 0,
        };
    },
};

export function Courses() {
    const apiRef = useGridApiRef();
    const [courseMenu, setCourseMenu] = useState<CourseMenuInstance>();

    const columns = useMemo((): GridColDef<AdminCourse>[] => {
        return [
            {
                field: "course_id",
                headerName: "Course ID",
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === "equals",
                ),
                flex: 0.2,
            },
            {
                field: "name",
                headerName: "Name",
                flex: 0.3,
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === "equals",
                ),
                renderCell: ({ row }) => {
                    return (
                        <Link to={paths.courses.update(row.slug)}>
                            {row.name}
                        </Link>
                    );
                },
            },
            {
                field: "city",
                headerName: "City",
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === "equals",
                ),
                flex: 0.2,
            },
            {
                field: "state",
                headerName: "State",
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === "equals",
                ),
                flex: 0.2,
            },
            {
                field: "is_simulator",
                headerName: "Is Simulator",
                align: "center",
                headerAlign: "center",
                sortable: false,
                flex: 0.2,
                filterOperators: getGridBooleanOperators(),
                renderCell: ({ row }) => {
                    if (!row.is_simulator) {
                        return null;
                    }
                    return "Yes";
                },
            },
            {
                field: "action",
                headerName: "",
                align: "right",
                sortable: false,
                flex: 0.1,
                filterable: false,
                renderCell: (params) => {
                    return (
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setCourseMenu({
                                    course: params.row,
                                    element: e.currentTarget,
                                });
                            }}
                        >
                            <MoreVert fontSize="small" />
                        </IconButton>
                    );
                },
            },
        ];
    }, []);

    return (
        <Card>
            <CardHeader
                title={
                    <Stack
                        direction="row"
                        alignContent="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h5">Courses</Typography>
                        <Button
                            to={paths.courses.create}
                            component={Link}
                            size="small"
                        >
                            New Course <Add />
                        </Button>
                    </Stack>
                }
            />
            <CardContent>
                <>
                    <CourseMenu
                        menu={courseMenu}
                        onClick={() => setCourseMenu(undefined)}
                        onDelete={() => apiRef.current?.dataSource.fetchRows()}
                    />
                    <DataGrid
                        showToolbar
                        columns={columns}
                        pagination
                        apiRef={apiRef}
                        dataSourceCache={null}
                        dataSource={dataSource}
                        getRowId={(row) => row.course_id}
                        slotProps={{
                            toolbar: {
                                printOptions: {
                                    disableToolbarButton: true,
                                },
                                csvOptions: {
                                    disableToolbarButton: true,
                                },
                                quickFilterProps: {
                                    debounceMs: 500,
                                },
                            },
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 25,
                                },
                            },
                            sorting: {
                                sortModel: [
                                    {
                                        field: "name",
                                        sort: "asc",
                                    },
                                ],
                            },
                        }}
                        onDataSourceError={(e) => console.log(e)}
                        pageSizeOptions={[10, 25, 50, 100]}
                        disableRowSelectionOnClick
                    />
                </>
            </CardContent>
        </Card>
    );
}
