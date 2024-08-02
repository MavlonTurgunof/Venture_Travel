const Tour = require('../models/tourModel');

const fs = require('fs');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.GetAllTours = async (req, res) => {
  try {
    //filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    //Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const query = Tour.find(JSON.parse(queryStr));

    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //Pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    //
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

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
