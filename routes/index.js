const express = require("express");
const router = express.Router();
const { sendResponse, AppError } = require("../helpers/utils.js");

// CAR
const carAPI = require("./car.api");
router.use("/car", carAPI);

router.get("/template/:test", async (req, res, next) => {
  const { test } = req.params;
  try {
    //turn on to test error handling
    if (test === "error") {
      throw new AppError(401, "Access denied", "Authentication Error");
    } else {
      sendResponse(
        res,
        200,
        true,
        { data: "template" },
        null,
        "template success"
      );
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;
