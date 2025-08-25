import { useCallback } from "react";

import { Delete } from "@mui/icons-material";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import axios from "axios";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router";

import { AdminCourse } from "../../types/Course";
import { paths } from "../routes";

export interface CourseMenuInstance {
    course: AdminCourse;
    element: HTMLElement;
}

export interface CourseMenuProps {
    menu?: CourseMenuInstance;
    onClick?: () => void;
    onDelete?: () => void;
}

export function CourseMenu({ menu, onClick, onDelete }: CourseMenuProps) {
    const navigate = useNavigate();
    const confirm = useConfirm();
    const deleteCourse = useCallback(async () => {
        if (!menu?.course) {
            return;
        }

        try {
            const { confirmed } = await confirm({
                description: "This will permanently remove the course.",
            });
            if (!confirmed) {
                return;
            }
            await axios.delete(`/api/courses/${menu.course.slug}`);
            onDelete?.();
            navigate(paths.courses.index);
        } catch (_) {
            // Do nothing
        }
    }, [menu?.course, navigate, confirm, onDelete]);

    return (
        <Menu
            anchorEl={menu?.element}
            open={!!menu}
            onClick={onClick}
            onClose={onClick}
            transformOrigin={{
                horizontal: "right",
                vertical: "top",
            }}
            anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
            }}
        >
            <MenuItem onClick={() => deleteCourse()} dense>
                <ListItemIcon>
                    <Delete color="error" />
                </ListItemIcon>
                Remove
            </MenuItem>
        </Menu>
    );
}
