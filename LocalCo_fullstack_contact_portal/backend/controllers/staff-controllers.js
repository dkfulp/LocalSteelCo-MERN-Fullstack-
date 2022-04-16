const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Staff = require("../models/staff");

const getStaff = async (req, res, next) => {
  let staffList;
  try {
    staffList = await Staff.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching staff list failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    staffList: staffList.map((staff) => staff.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingStaff;
  try {
    existingStaff = await Staff.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingStaff) {
    const error = new HttpError(
      "Staff member exists already, please login instead.",
      422
    );
    return next(error);
  }

  const createdStaff = new Staff({
    name,
    email,
    password,
  });

  try {
    await createdStaff.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ staff: createdStaff.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingStaff;
  try {
    existingStaff = await Staff.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Loggin in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingStaff || existingStaff.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  delete existingStaff._doc.password;

  res.json({
    message: "Logged in!",
    staff: existingStaff.toObject({ getters: true }),
  });
};

exports.getStaff = getStaff;
exports.signup = signup;
exports.login = login;
