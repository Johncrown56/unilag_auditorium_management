const asyncHandler = require("express-async-handler");
const { executeQuery } = require("../config/connection");
const logger = require("../utils/logger");
const { dateTime, validateRole } = require("../utils/functions");

const userStats = async (value) => {
  const result = await executeQuery(
    "SELECT userCategory, COUNT(*) as userCount FROM users WHERE userCategory = ? GROUP BY userCategory ",
    [value]
  );
  return result;
};

const validateUser = async (id) => {
  const check = await executeQuery("SELECT * FROM users WHERE userId = ? ", [
    id,
  ]);
  return check; //.length > 0 ? true : false;
}


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

const update = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;
  if (!userId) {
    res.status(400);
    throw new Error("Please provide user id");
  }

  if(!validateRole(role)){
    res.status(400);
    throw new Error("Role must be user, admin, superadmin or poweradmin");
  }  

  const check = await validateUser(userId);
  
  if (check.length === 0) {
    res.status(400);
    throw new Error("User Id does not exist");
  }

  const userCategory = check[0].userCategory;

  if((role.includes("admin")) && userCategory !== "Staff"){
    res.status(400);
    throw new Error("This user can not be assigned admin priviledge");
  }
    const dateUpdated = dateTime();
    console.log({dateUpdated})
    const query = "UPDATE `users` SET `role` = ?, `dateUpdated` = ? WHERE `userId` = ? ";
    const save = await executeQuery(query, [role, dateUpdated, userId]);
    if (save) {
      const data = { userId, role, dateUpdated };
      res.status(200).json({
        success: true,
        message: "User Updated successfully",
        data: data,
      });
    } else {
      res.status(400).json({ success: false, message: "User not updated" });
    }
  
});

const fetch = asyncHandler(async (req, res) => {
  const {role, userCategory} = req.query;
  let check;
  if(!role && !userCategory) check = await executeQuery("SELECT * FROM users ORDER BY id DESC", [])
  if(role) check = await executeQuery("SELECT * FROM users WHERE role = ? ORDER BY id DESC", [role]);
  if(userCategory) check = await executeQuery("SELECT * FROM users WHERE userCategory = ? ORDER BY id DESC ", [userCategory]);
  // console.log(check);
  if (check) {
    res.status(200).json({
      success: true,
      message: `Data fetched successfully`,
      data: check,
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: `Data could not be fetched` });
  }
});

// delete user. Only superadmin or poweradmin can delete a user
const remove = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(400);
    throw new Error("Please provide user id");
  }
  // validate if user exists
  const check = await validateUser(userId);
  if (check.length === 0) {
    res.status(400);
    throw new Error("User Id does not exist");
  }
  // check if user has booked before. A user can only be deleted if he/she has not booked before
  const sql = "SELECT userId FROM bookings Where userId = ? "
  const selectUser = await executeQuery(sql, [userId]);
  if(selectUser.length > 0){
    res.status(400);
    throw new Error("User can not be deleted because he/she has booked before");
  }

  // check if user has created auditorium before. A user can only be deleted if he/she has not created auditorium before
  const sql2 = "SELECT userId FROM bookings Where userId = ? "
  const selectUser2 = await executeQuery(sql2, [userId]);
  if(selectUser2.length > 0){
    res.status(400);
    throw new Error("User can not be deleted because he/she has created auditorium before");
  }

  const query = "DELETE FROM `users` WHERE `userId` = ? ";
  const deleteUser = await executeQuery(query, [userId]);
  if (deleteUser) {
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: "User could not deleted" });
  }

});

module.exports = {
  userCount,
  update,
  fetch,
  remove
};
