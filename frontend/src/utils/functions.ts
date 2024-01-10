import moment from "moment";

export const Greeting = () => {
  const time = moment().hours();
  if (time < 10) {
    return "Good Morning,";
  } else if (time < 16) {
    return "Good Afternoon,";
  } else if (time < 20) {
    return "Good Evening,";
  } else {
    return "Good Evening,";
  }
};

export const setNestedProperty = (
  object: Record<string, any>,
  path: string,
  value: any
) => {
  const keys = path.split(".");
  let currentObject = object;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!currentObject[key]) {
      currentObject[key] = {};
    }
    currentObject = currentObject[key];
  }

  currentObject[keys[keys.length - 1]] = value;
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + "" + sizes[i];
};

export const checkValidTime = (time: Date) => {
  const isBetween7AMand6PM = moment(time).isBetween(
    moment(time).set({ hour: 7, minute: 0, second: 0 }),
    moment(time).set({ hour: 18, minute: 0, second: 0 }),
    null,
    "[]"
  );
  return isBetween7AMand6PM ? true : false;
};

// Calculate the sum of the amounts
export const calculateTotalAmount = (prices: any) => {
  const price = prices.reduce(
    (sum: any, item: any) => Number(sum) + parseFloat(item.amount || 0),
    0
  );
  return price;
};
