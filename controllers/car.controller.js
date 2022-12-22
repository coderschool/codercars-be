const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};
const _ = require("lodash");

// TODO: find way to hide field isDeleted after create
carController.createCar = async (req, res, next) => {
  try {
    const { make, model, price, release_date, size, style, transmission_type } =
      req.body;

    if (!make || !model || !size || !style || !transmission_type) {
      const exception = new Error(`Missing required data.`);
      exception.statusCode = 401;
      throw exception;
    }

    if (typeof price !== "number") {
      const exception = new Error(`Price value must be a number.`);
      exception.statusCode = 401;
      throw exception;
    }

    if (typeof release_date !== "number") {
      const exception = new Error(`Release Date value must be a number.`);
      exception.statusCode = 401;
      throw exception;
    }

    if (release_date <= 0) {
      const exception = new Error(
        `The Release Date value must be larger than 0.`
      );
      exception.statusCode = 401;
      throw exception;
    }

    if (price < 1000) {
      const exception = new Error(
        `The Price value must be equal or larger than 1000.`
      );
      exception.statusCode = 401;
      throw exception;
    }

    let transmissionTypeValue = transmission_type.toUpperCase().trim();
    if (
      !Car.schema
        .path("transmission_type")
        .enumValues.includes(transmissionTypeValue)
    ) {
      const exception = new Error(
        `Tranmission Type is invalid. Must belong to one of these values 'MANUAL', 'AUTOMATIC', 'AUTOMATED_MANUAL', 'DIRECT_DRIVE', 'UNKNOWN'`
      );
      exception.statusCode = 401;
      throw exception;
    }

    let sizeValue = _.capitalize(size).trim();
    if (!Car.schema.path("size").enumValues.includes(sizeValue)) {
      const exception = new Error(
        `Size is invalid. Must belong to one of these values 'Compact', 'Midsize', 'Large'`
      );
      exception.statusCode = 401;
      throw exception;
    }

    // prepare request body to create
    const requestBody = {
      make,
      model,
      release_date,
      transmission_type: transmissionTypeValue,
      size: sizeValue,
      style,
      price,
    };

    const createdCar = await Car.create(requestBody);

    // create response data object
    const responseData = {
      data: {
        message: "Create Car Successfully!",
        car: createdCar,
      },
    };

    // send response
    res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};

carController.getCars = async (req, res, next) => {
  try {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // number of items skip for selection
    let offset = limit * (page - 1);

    // query to get total pages based on total cars returned with flag isDeleted false
    let totalPages = await Car.find({ isDeleted: false })
      .sort({ _id: -1 })
      .count();
    totalPages = Math.ceil(totalPages / limit);

    // query to get list of cars based on offset and limit, and with flag isDeleted false, not show isDeleted field in front-end
    const listOfCars = await Car.find({ isDeleted: false }, { isDeleted: 0 })
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit);

    // create response data object
    const responseData = {
      data: {
        message: "Get Car List Successfully!",
        cars: listOfCars,
        page: page,
        total: totalPages,
      },
    };

    // send response
    res.status(200).send(responseData);
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
