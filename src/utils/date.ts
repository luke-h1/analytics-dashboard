import { format, subDays } from "date-fns";

export const getDate = (sub: number = 0): string => {
  const dateXDaysAgo = subDays(new Date(), sub);

  return format(dateXDaysAgo, "dd/MM/yyyy");
};
