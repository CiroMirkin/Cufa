import home from "@/assets/icons/home.svg"
import calendar_event from "@/assets/icons/calendar-event.svg"
import file_description from "@/assets/icons/file-description.svg"
import trash from "@/assets/icons/trash.svg"
import dots_vertical from "@/assets/icons/dots-vertical.svg"
import pencil from "@/assets/icons/pencil.svg"
import library from "@/assets/icons/library.svg"
import archive from "@/assets/icons/archive.svg"
import plus from "@/assets/icons/plus.svg"
import clock_plus from "@/assets/icons/clock-plus.svg"
import save from "@/assets/icons/device-floppy.svg"

export const icons = {
    home,
    file_description,
    library,
    calendar_event,
    trash,
    dots_vertical,
    pencil,
    plus,
    archive,
    clock_plus,
    save,
} as const;

export type IconKey = keyof typeof icons
