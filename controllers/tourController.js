const Tour = require('../models/tourModel');

const fs = require('fs');

exports.GetAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const query = Tour.find(queryObj);

    const Tours = await query;

    res.status(200).json({
      status: 'success',
      results: Tours.length,
      data: {
        tours: Tours,
      },
    });
  } catch (err) {
    res.status(202).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.GetTour = async (req, res) => {
  try {
    const Tour = await Tour.findById(req.params.id);

    if (!Tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'invalid ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour: Tour,
      },
    });
  } catch (err) {
    res.status(202).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.UpdateTour = async (req, res) => {
  try {
    const Tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!Tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'invalid ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour: Tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.CreateTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.DeleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(201).json({
      status: 'fail',
      message: err,
    });
  }
};
