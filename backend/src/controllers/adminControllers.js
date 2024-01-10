const asyncHandler = require("express-async-handler");
const { executeQuery } = require("../config/connection");
const logger = require("../utils/logger");

const userStats = async (value) => {
  const result = await executeQuery(
    "SELECT userCategory, COUNT(*) as userCount FROM users WHERE userCategory = ? GROUP BY userCategory ",
    [value]
  );
  return result;
};

const userCount = asyncHandler(async (req, res) => {
  try {
    const staff = await userStats("Staff");
    const student = await userStats("Student");
    const organization = await userStats("Organization");
    const individual = await userStats("Individual");

    if (staff || student || organization || individual) {
      res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: {
          staff: staff[0]?.userCount || 0,
          student: student[0]?.userCount || 0,
          organization: organization[0]?.userCount || 0,
          individual: individual[0]?.userCount || 0,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error fetching data",
      });
    }
  } catch (error) {
    console.log(error);
    logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
  }
});

module.exports = {
  userCount,
};
