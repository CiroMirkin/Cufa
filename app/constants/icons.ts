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
import chevron_right from "@/assets/icons/chevron-right.svg"
import link from "@/assets/icons/link.svg"
import user from "@/assets/icons/user.svg"
import close from "@/assets/icons/x.svg"
import settings from "@/assets/icons/settings.svg"
import check from "@/assets/icons/check.svg"

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
    chevron_right,
    close,
    settings,
    user,
    link,
    check,
} as const;

export type IconKey = keyof typeof icons
