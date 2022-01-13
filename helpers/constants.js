export const day = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const dateDDMMYYYY = () => {
  return new Date()
    .toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
    })
    .split(", ")[0];
};

export const timeHHMM = () => {
  return new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
    hour12: false,
    timeStyle: "short",
  });
};

const dayId = new Date().getDay();
export const dayOfWeek = day[dayId];
