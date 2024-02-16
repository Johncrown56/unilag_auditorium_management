const asyncHandler = require("express-async-handler");
const { executeQuery } = require("../config/connection");
const { dateTime } = require("../utils/functions");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const create = asyncHandler(async (req, res) => {
  const {
    name,
    capacity,
    description,
    price,
    discount,
    layout,
    features,
    images,
    vat,
    cautionFee,
    cleaningCharges,
    studentPrice,
    active,
  } = req.body;
  const userId = req.user.userId;
  if (
    !name ||
    !capacity ||
    !description ||
    !price ||
    !cautionFee ||
    !features
  ) {
    res.status(400);
    throw new Error("Please provide all compulsory fields");
  }

  // check if auditorium already exist
  const checkAuditorium = await executeQuery(
    "SELECT `name` FROM `auditoriums` WHERE name = ?",
    [name] 
  );
  if (checkAuditorium.length > 0) {
    res
      .status(400)
      .json({ success: false, message: "Auditorium already exists" });
  }

  const dateCreated = dateTime();
  const dateUpdated = dateTime();
  const audID = uuidv4();

  if (images.length > 0) {
    try {
      //createFolderIfNotExists("uploads");
      const uploadsDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      const base64Images = images.map((image, index) => {
        return {
          name: `${Math.floor(Date.now() / 1000) + 60 * 60}_${index + 1}.png`, // Use a dynamic name or the original name
          type: image.type,
          data: image.data,
        };
      });

      // Process the base64Images as needed (e.g., save to disk or database)
      base64Images.forEach(async (image, index) => {
        const fileName = image.name;
        const imagePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(imagePath, Buffer.from(image.data, "base64"));
        const sql =
          "INSERT INTO `auditorium_images` ( `fileName`, `dateCreated`, `dateUpdated`, `audID`) VALUES ( ?, ?, ?, ? ) ";
        await executeQuery(sql, [fileName, dateCreated, dateUpdated, audID]);
        return { index: index + 1, fileName: fileName };
      });

      features.forEach(async (feature, index) => {
        const featureSql =
          "INSERT INTO `auditorium_features` (`featureID`, `audID`) VALUES (?, ?) ";
        await executeQuery(featureSql, [feature, audID]);
        return { index: index + 1, feature };
      });

      const query =
        "INSERT INTO `auditoriums` ( `audID`, `name`, `description`, `layout`, `capacity`, `price`, `discount`, `vat`, `cautionFee`, `cleaningCharges`, `studentPrice`, `active`, `dateCreated`, `dateUpdated`, `userID`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const save = await executeQuery(query, [
        audID,
        name,
        description,
        layout,
        capacity,
        price,
        Number(discount),
        vat,
        cautionFee,
        cleaningCharges,
        studentPrice,
        active,
        dateCreated,
        dateUpdated,
        userId,
      ]);
      if (save) {
        const data = {
          audID,
          name,
          description,
          layout,
          capacity,
          price,
          discount,
          vat,
          cautionFee,
          cleaningCharges,
          studentPrice,
          active,
          dateCreated,
          dateUpdated,
        };
        // Respond with a success message
        res.status(200).json({
          success: true,
          message: "Auditorium Created successfully",
          responseMessage: "Images uploaded successfully",
          data: { data, base64Images, features },
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Auditorium not created" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "No images uploaded" });
  }
});

const update = asyncHandler(async (req, res) => {
  const { name, capacity, description, price, discount, layout, active } =
    req.body;
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide auditorium id");
  }
  if (!name) {
    res.status(400);
    throw new Error("Please provide auditorium name");
  }
  const check = await executeQuery(
    "SELECT `id` FROM `auditoriums` WHERE audID = ? ",
    [id]
  );
  if (check[0]) {
    const dateUpdated = dateTime();
    const query =
      "UPDATE `auditoriums` SET `name` = ?, `description` = ?, `layout` = ?, `capacity` = ?, `price` = ?, `discount` = ?, `active` = ?, `dateUpdated` = ? WHERE `audID` = ? ";
    const save = await executeQuery(query, [
      name,
      description,
      layout,
      capacity,
      price,
      discount,
      active,
      dateUpdated,
      id,
    ]);
    if (save) {
      const data = { id, name, dateUpdated };
      res.status(200).json({
        success: true,
        message: "Auditorium Updated successfully",
        data: data,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Auditorium not updated" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "Auditorium Id does not exist" });
  }
});

const remove = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide auditorium id");
  }
  const check = await executeQuery(
    "SELECT `id` FROM `auditoriums` WHERE audID = ? ",
    [id]
  );
  if (check[0]) {
    const query = "DELETE FROM `auditoriums` WHERE `audID` = ? ";
    const deleteFeature = await executeQuery(query, [id]);
    if (deleteFeature) {
      res.status(200).json({
        success: true,
        message: "Auditorium deleted successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Auditorium could not deleted" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "Auditorium Id does not exist" });
  }
});

const fetch = asyncHandler(async (req, res) => {
  try {
    const auditoriumData = await executeQuery(
      "SELECT * FROM `auditoriums` ",
      []
    );

    const promises = auditoriumData.map(async (auditorium) => {
      const images = await executeQuery(
        "SELECT `id`, `fileName`, `dateCreated` FROM `auditorium_images` WHERE audID = ?",
        [auditorium.audID]
      );

      const newImages = images.map((image, index) => {
        return {
          sn: index + 1,
          fileName: `${process.env.SERVER_URL}${process.env.PORT}/uploads/${image.fileName}`,
          id: image.id,
          audID: image.audID,
        };
      });

      const features = await executeQuery(
        "SELECT auditorium_features.id AS audFeatureID, auditorium_features.featureID AS featureID, auditorium_features.audID, features.name FROM auditorium_features JOIN features ON auditorium_features.featureID = features.id WHERE auditorium_features.audID = ? ",
        [auditorium.audID]
      );

      return { ...auditorium, images: newImages, features };
    });

    const auditoriumsWithImages = await Promise.all(promises);
    if (auditoriumsWithImages) {
      res.status(200).json({
        success: true,
        message: "Auditorium fetched successfully",
        data: auditoriumsWithImages,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Auditorium could not be fetched" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const fetchOne = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an auditorium id");
  }

  try {
    const auditoriumData = await executeQuery(
      "SELECT * FROM `auditoriums` WHERE `audID` = ? ",
      [id]
    );
    const promises = auditoriumData.map(async (auditorium) => {
      const images = await executeQuery(
        "SELECT `id`, `fileName`, `dateCreated` FROM `auditorium_images` WHERE audID = ?",
        [auditorium.audID]
      );

      const features = await executeQuery(
        "SELECT auditorium_features.id AS audFeatureID, auditorium_features.featureID AS featureID, auditorium_features.audID, features.name FROM auditorium_features JOIN features ON auditorium_features.featureID = features.id WHERE auditorium_features.audID = ? ",
        [auditorium.audID]
      );

      const newImages = images.map((image, index) => {
        return {
          sn: index + 1,
          fileName: `${process.env.SERVER_URL}${process.env.PORT}/uploads/${image.fileName}`,
          id: image.id,
          audID: image.audID,
        };
      });

      return { ...auditorium, images: newImages, features };
    });

    const auditoriumsWithImages = await Promise.all(promises);
    if (auditoriumsWithImages) {
      res.status(200).json({
        success: true,
        message: "Auditorium fetched successfully",
        data: auditoriumsWithImages,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Auditorium could not be fetched" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const fetchImages = asyncHandler(async (req, res) => {
  // Read the 'uploads' directory and get a list of filenames
  fs.readdir("src/controllers/uploads", (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).send("Internal Server Error");
    } else {
      const imageList = files.map((filename) => ({
        filename,
        originalname: filename, // You can replace this with actual metadata
      }));
      res.json(imageList);
    }
  });
});

module.exports = {
  create,
  update,
  fetch,
  remove,
  fetchOne,
  fetchImages,
};
