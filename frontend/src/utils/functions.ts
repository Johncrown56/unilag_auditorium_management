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

// Create an array of the last 12 months
export const last12Months = Array.from({ length: 12 }, (_, index) =>
  moment().clone().subtract(index, 'months').format('MMM YYYY')
).reverse();

// Create an array of the last 30 days
export const last30Days = Array.from({ length: 30 }, (_, index) =>
moment().clone().subtract(index, 'days').format('DD-MM')
).reverse();

// Create an array of the last 7 days
export const last7Days = Array.from({ length: 7 }, (_, index) =>
moment().clone().subtract(index, 'days').format('DD-MM') 
).reverse();


export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

export const formatCurrency = (value: number) => {
  // Format the number as currency with Nigerian Naira (NGN) symbol
  return '₦' + value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const joinArray = (array: string[]) => {
  return array.join(', ')
}

export const joinNames = (data: any[]) => {
  return data.map(item => item?.name).join(', ');
}

export const capitalizeFirstLetter = (str: string)=> {
  // Ensure the word is not empty
  if (!str) return '';
  // Capitalize the first letter and concatenate it with the rest of the word
  return str.charAt(0).toUpperCase() + str.slice(1);
}
