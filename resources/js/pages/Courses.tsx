import { Map } from "@mui/icons-material";
import {
    Alert,
    Button,
    Card,
    CardContent,
    CardHeader,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import {
    DataGrid,
    getGridStringOperators,
    GridColDef,
    GridDataSource,
    GridGetRowsParams,
    GridGetRowsResponse,
} from "@mui/x-data-grid";
import axios from "axios";
import { Link as RouterLink } from "react-router";

import { AppContainer } from "../components/AppContainer";
import { paths } from "../routes";
import { ApiPaginatedResponse } from "../types/api";
import { Course } from "../types/Course";

const columns: GridColDef<Course>[] = [
    {
        field: "name",
        headerName: "Name",
        flex: 0.6,
        filterOperators: getGridStringOperators().filter(
            (operator) => operator.value === "equals",
        ),
        renderCell: (params) => {
            return (
                <Link component={RouterLink} to={paths.course(params.row.slug)}>
                    {params.row.name}
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
        renderCell: (params) => {
            return (
                <Link
                    href={`https://www.google.com/maps/place/${params.row.latitude},${params.row.longitude}/@${params.row.latitude},${params.row.longitude},11z`}
                    target="_blank"
                >
                    <Stack direction="row" alignItems="center">
                        <Map fontSize="small" /> <span>{params.row.city}</span>
                    </Stack>
                </Link>
            );
        },
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
        field: "country",
        headerName: "Country",
        filterOperators: getGridStringOperators().filter(
            (operator) => operator.value === "equals",
        ),
        flex: 0.2,
    },
];

export function Courses() {
    const dataSource: GridDataSource = {
        getRows: async (
            params: GridGetRowsParams,
        ): Promise<GridGetRowsResponse> => {
            const query = new URLSearchParams();

            query.set("is_simulator", "0");
            query.set(
                "page",
                ((params.paginationModel?.page ?? 0) + 1).toString(),
            );
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
                query.set(
                    "search",
                    params.filterModel.quickFilterValues.join(" "),
                );
            }

            try {
                const { data } = await axios.get<ApiPaginatedResponse<Course>>(
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

    return (
        <AppContainer>
            <Stack>
                <Alert
                    color="warning"
                    sx={{
                        boxShadow: 1,
                    }}
                >
                    Only US courses are supported at the moment.
                </Alert>
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
                                    to={paths.requestCourse}
                                    component={RouterLink}
                                    size="small"
                                    color="success"
                                >
                                    Don't see a course?
                                </Button>
                            </Stack>
                        }
                    />
                    <CardContent>
                        <DataGrid
                            showToolbar
                            columns={columns}
                            pagination
                            dataSourceCache={null}
                            dataSource={dataSource}
                            getRowId={(row) => row.slug}
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
                    </CardContent>
                </Card>
            </Stack>
        </AppContainer>
    );
}
