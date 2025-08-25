import { createTheme, ThemeOptions } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";

const CARD_SPACING = 3;

const themeOptions: ThemeOptions = {
    palette: {
        mode: "light",
        background: {
            default: "#dddddd",
        },
        DataGrid: {
            // Container background
            bg: "#f8fafc",
            // Pinned rows and columns background
            pinnedBg: "#f1f5f9",
            // Column header background
            headerBg: "#eaeff5",
        },
        // See how you can customize your theme's palette: https://mui.com/material-ui/customization/palette/
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        // Learn how to globally customize your components: https://mui.com/material-ui/customization/theme-components/
        MuiGrid: {
            // You can customize a component's default properties
            defaultProps: {
                spacing: 2,
            },
        },
        MuiStack: {
            defaultProps: {
                gap: 2,
            },
        },
        MuiTextField: {
            defaultProps: {
                fullWidth: true,
                size: "small",
            },
        },
        MuiDatePicker: {
            defaultProps: {
                slotProps: {
                    textField: {
                        size: "small",
                    },
                },
            },
        },
        MuiSelect: {
            defaultProps: {
                size: "small",
            },
        },
        MuiCheckbox: {
            defaultProps: {
                size: "small",
            },
        },
        MuiButton: {
            defaultProps: {
                variant: "contained",
            },
        },
        MuiInputLabel: {
            defaultProps: {
                size: "small",
            },
        },
        MuiMenuItem: {
            defaultProps: {
                dense: true,
            },
        },
        MuiAppBar: {
            // You can also customize component's default styles
            styleOverrides: {
                root: ({ theme }) => ({
                    marginBottom: theme.spacing(4),
                }),
            },
        },
        MuiCard: {
            styleOverrides: {
                root: () => ({
                    // You can customize components having different classes, such as a "clickable" class
                    "&.clickable": {
                        transition: "0.4s",
                        cursor: "pointer",
                        "&:hover": {
                            filter: "brightness(1.25)",
                        },
                    },
                }),
            },
        },
        MuiCardHeader: {
            styleOverrides: {
                root: ({ theme }) => ({
                    paddingLeft: theme.spacing(CARD_SPACING),
                    paddingRight: theme.spacing(CARD_SPACING),
                    paddingBottom: 0,
                }),
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: ({ theme }) => ({
                    height: "100%",
                    padding: theme.spacing(CARD_SPACING),
                    // You can even customize nested styles
                    "&:last-child": {
                        paddingBottom: `${theme.spacing(CARD_SPACING)}!Important`,
                    },
                }),
            },
        },
        MuiCardActions: {
            styleOverrides: {
                root: ({ theme }) => ({
                    paddingLeft: theme.spacing(CARD_SPACING),
                    paddingRight: theme.spacing(CARD_SPACING),
                    paddingBottom: theme.spacing(CARD_SPACING),
                    justifyContent: "right",
                }),
            },
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;
