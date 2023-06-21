const { sendResponse, AppError } = require("../helpers/utils.js");
const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};

carController.createCar = async (req, res, next) => {
  const { make, model, year, transmission_type, size, style, price } = req.body;
  const info = {
    make,
    model,
    year,
    transmission_type,
    size,
    style,
    price,
  };
  try {
    // YOUR CODE HERE
    // 	//always remember to control your inputs
    if (!info) throw new AppError(402, "Bad Request", "Create car Error");

    // 	//mongoose query
    const created = await Car.create(info);
    res
      .status(200)
      .send({ message: "Create Car Successfully!", data: created });
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const listOfFound = await Car.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await Car.count({ isDeleted: false });
    console.log(count);
    const totalPages = Math.ceil(count / limit);

    res.status(200).send({
      message: "Get Car List Successfully!",
      data: listOfFound,
      page: page,
      total: totalPages,
    });
  } catch (err) {
    // YOUR CODE HERE
  }
};

carController.editCar = async (req, res, next) => {
  const targetId = req.params.id;
  const updateInfo = req.body;
  const options = { new: true };
  try {
    // YOUR CODE HERE

    const updated = await Car.findByIdAndUpdate(targetId, updateInfo, options);
    res
      .status(200)
      .send({ message: "Update Car Successfully!", data: updated });
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  const targetId = req.params.id;
  const options = { new: true };
  try {
    // YOUR CODE HERE
    const deleted = await Car.findByIdAndUpdate(
      targetId,
      { isDeleted: true },
      options
    );
    sendResponse(
      res,
      200,
      true,
      { data: "oke" },
      null,
      "Delete Car Successfully!"
    );
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

module.exports = carController;
