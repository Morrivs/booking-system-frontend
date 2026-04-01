import dayjs from "dayjs";

export const DateHelper = {
    isPast(date: Date | string) {
        return dayjs(date).isBefore(dayjs());
    },

    diffDays(start: Date | string, end: Date | string) {
        return Math.max(1, dayjs(end).diff(dayjs(start), "day"));
    },

    formatDate(date: Date | string) {
        return dayjs(date).format("DD MMM YYYY");
    }
}