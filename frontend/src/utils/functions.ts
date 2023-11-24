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
