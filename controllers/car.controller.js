const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};

carController.createCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
  } catch (err) {
    // YOUR CODE HERE
  }
};

// TODO: implementing
carController.getCars = async (req, res, next) => {
  try {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // number of items skip for selection
    let offset = limit * (page - 1);

    // query to get total pages based on total cars returned
    let totalPages = await Car.find({}).sort({ _id: -1 }).count();
    totalPages = Math.ceil(totalPages / limit);

    // query to get list of cars based on offset and limit
    const listOfCars = await Car.find({})
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit);

    // create response data object
    const responseData = {
      message: "Get Car List Successfully!",
      cars: listOfCars,
      page: page,
      total: totalPages,
    };

    // send response
    res.status(200).send({ data: responseData });
  } catch (error) {
    next(error);
  }
};

carController.editCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
  } catch (err) {
    // YOUR CODE HERE
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
  } catch (err) {
    // YOUR CODE HERE
  }
};

module.exports = carController;
