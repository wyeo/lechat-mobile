import dayjs from "dayjs";

export const formatDate = (
  date: Date | dayjs.Dayjs | string,
  template = "YYYY-MM-DD"
) => dayjs(date).format(template);

export default dayjs;
