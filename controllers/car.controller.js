const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};
const _ = require("lodash");

// api to delete car by id
carController.deleteCar = async (req, res, next) => {
  try {
    // get carId from params
    const { id: carId } = req.params;

    // options allow you to modify query, {new: true} return latest update version of data
    const options = { new: true, projection: { isDeleted: 0 } };

    // doing the soft delete mean updated isDelete to true
    const deletedCar = await Car.findByIdAndUpdate(
      carId,
      { isDeleted: true },
      options
    );

    // create response data object
    const responseData = {
      data: {
        message: "Delete Car Successfully!",
        car: deletedCar,
      },
    };

    // send response
    res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};

// api to update car by id
carController.editCar = async (req, res, next) => {
  try {
    // get carId from params
    const { id: carId } = req.params;
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

    // prepare request body to update
    const requestBody = {
      make,
      model,
      release_date,
      transmission_type: transmissionTypeValue,
      size: sizeValue,
      style,
      price,
    };

    // options allow you to modify query, {new: true} return latest update version of data
    const options = { new: true, projection: { isDeleted: 0 } };

    // update car data
    const updatedCar = await Car.findByIdAndUpdate(carId, requestBody, options);

    // create response data object
    const responseData = {
      data: {
        message: "Update Car Successfully!",
        car: updatedCar,
      },
    };

    // send response
    res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};

// api to create a new car
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

    const createdCar = await Car.create(requestBody, { options: {} });

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

// api to get all cars
carController.getCars = async (req, res, next) => {
  try {
    const allowedFilter = ["search", "page", "limit"];

    let { page, limit, ...filterQuery } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new Error(`Query ${key} is not allowed`);
        exception.statusCode = 401;
        throw exception;
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });

    // number of items skip for selection
    let offset = limit * (page - 1);

    let totalPages = 0;
    let listOfCars = [];

    if (filterKeys.length) {
      // just allow filter with "search" here, update code in future with more filter fields
      let filterValue = _.toLower(filterQuery["search"].trim());

      // query to get total pages based on total cars returned with flag isDeleted false
      totalPages = await Car.find(
        {
          $text: { $search: filterValue },
          isDeleted: false,
        },
        { isDeleted: 0 }
      )
        .sort({ _id: -1 })
        .count();
      totalPages = Math.ceil(totalPages / limit);

      // list of cars with search filter
      listOfCars = await Car.find(
        {
          $text: { $search: filterValue },
          isDeleted: false,
        },
        { isDeleted: 0 }
      )
        .sort({ _id: -1 })
        .skip(offset)
        .limit(limit);
    } else {
      // query to get total pages based on total cars returned with flag isDeleted false
      totalPages = await Car.find({ isDeleted: false })
        .sort({ _id: -1 })
        .count();
      totalPages = Math.ceil(totalPages / limit);

      // query to get list of cars based on offset and limit, and with flag isDeleted false, not show isDeleted field in front-end
      listOfCars = await Car.find({ isDeleted: false }, { isDeleted: 0 })
        .sort({ _id: -1 })
        .skip(offset)
        .limit(limit);
    }

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

module.exports = carController;
