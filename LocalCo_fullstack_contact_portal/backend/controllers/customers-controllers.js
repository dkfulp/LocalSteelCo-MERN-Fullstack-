const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Customer = require("../models/customer");
const Question = require("../models/question");

const getCustomers = async (req, res, next) => {
  let customers;
  try {
    customers = await Customer.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching customers failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    customers: customers.map((customer) =>
      customer.toObject({ getters: true })
    ),
  });
};

const getCustomerById = async (req, res, next) => {
  const customerId = req.params.cid;

  let customer;
  try {
    customer = await Customer.findById(customerId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find customer.",
      500
    );
    return next(error);
  }

  if (!customer) {
    const error = new HttpError(
      "Could not find a customer for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ customer: customer.toObject({ getters: true }) });
};

const getCustomerByEmail = async (req, res, next) => {
  const customerEmail = req.params.cemail;

  let customer;
  try {
    customer = await Customer.findOne({ email: customerEmail });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find customer.",
      500
    );
    return next(error);
  }

  res.json({ customer: customer.toObject({ getters: true }) });
};

const checkCustomerExistsByEmail = async (req, res, next) => {
  const customerEmail = req.params.cemail;

  Customer.exists({ email: customerEmail }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

const addCustomer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, phone, newsletter } = req.body;

  let existingCustomer;
  try {
    existingCustomer = await Customer.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Customer addition failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingCustomer) {
    const error = new HttpError(
      "Customer exists already, please contact an administrator.",
      422
    );
    return next(error);
  }

  const createdCustomer = new Customer({
    name,
    email,
    phone,
    newsletter,
    questions: [],
  });

  try {
    await createdCustomer.save();
  } catch (err) {
    const error = new HttpError(
      "Customer creation failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ customer: createdCustomer.toObject({ getters: true }) });
};

const updateCustomer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, phone, newsletter } = req.body;
  const customerId = req.params.cid;

  let customer;
  try {
    customer = await Customer.findById(customerId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update customer.",
      500
    );
    return next(error);
  }

  if (!customer) {
    const error = new HttpError("Could not find customer for this id.", 404);
    return next(error);
  }

  customer.name = name;
  customer.email = email;
  customer.phone = phone;
  customer.newsletter = newsletter;

  try {
    await customer.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update customer.",
      500
    );
    return next(error);
  }

  res.status(200).json({ customer: customer.toObject({ getters: true }) });
};

const deleteCustomer = async (req, res, next) => {
  const customerId = req.params.cid;

  let customer;
  try {
    customer = await Customer.findById(customerId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete customer.",
      500
    );
    return next(error);
  }

  if (!customer) {
    const error = new HttpError("Could not find customer for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Question.deleteMany({ customer: customerId }, { session: sess });
    await Customer.deleteOne({ _id: customerId }, { session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete customer.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted customer and all related data." });
};

exports.getCustomers = getCustomers;
exports.getCustomerById = getCustomerById;
exports.getCustomerByEmail = getCustomerByEmail;
exports.checkCustomerExistsByEmail = checkCustomerExistsByEmail;
exports.addCustomer = addCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
