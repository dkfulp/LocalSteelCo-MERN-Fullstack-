const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

const HttpError = require("../models/http-error");
const Customer = require("../models/customer");
const Question = require("../models/question");

const getQuestions = async (req, res, next) => {
  let questions;
  try {
    questions = await Question.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching questions failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    questions: questions.map((question) =>
      question.toObject({ getters: true })
    ),
  });
};

const getQuestionById = async (req, res, next) => {
  const questionId = req.params.qid;

  let question;
  try {
    question = await Question.findById(questionId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find question.",
      500
    );
    return next(error);
  }

  if (!question) {
    const error = new HttpError(
      "Could not find a question for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ question: question.toObject({ getters: true }) });
};

const getQuestionsByCustomerId = async (req, res, next) => {
  const customerId = req.params.cid;

  let questions;
  try {
    questions = await Question.find({ customer: customerId });
  } catch (err) {
    const error = new HttpError(
      "Fetching questions failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!questions) {
    const error = new HttpError(
      "Could not find questions for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    questions: questions.map((question) =>
      question.toObject({ getters: true })
    ),
  });
};

const addQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { customer, submitted, description } = req.body;

  const createdQuestion = new Question({
    customer,
    submitted,
    description,
  });

  let creator;
  try {
    creator = await Customer.findById(customer);
  } catch (err) {
    const error = new HttpError(
      "Creating question failed, please try again.",
      500
    );
    return next(error);
  }

  if (!creator) {
    const error = new HttpError(
      "Could not find customer for provided id.",
      404
    );
    return next(error);
  }

  console.log(creator);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdQuestion.save({ session: sess });
    creator.questions.push(createdQuestion);
    await creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating question failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ question: createdQuestion });
};

const updateQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { description } = req.body;
  const questionId = req.params.qid;

  let question;
  try {
    question = await Question.findById(questionId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update question.",
      500
    );
    return next(error);
  }

  question.description = description;

  try {
    await question.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update question.",
      500
    );
    return next(error);
  }

  res.status(200).json({ question: question.toObject({ getters: true }) });
};


const deleteQuestion = async (req, res, next) => {
    const questionId = req.params.qid;
  
    let question;
    try {
      question = await Question.findById(questionId).populate('customer');
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete question.',
        500
      );
      return next(error);
    }
  
    if (!question) {
      const error = new HttpError('Could not find question for this id.', 404);
      return next(error);
    }
  
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await question.remove({session: sess});
      question.customer.questions.pull(question);
      await question.customer.save({session: sess});
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete question.',
        500
      );
      return next(error);
    }
    
    res.status(200).json({ message: 'Deleted question.' });
  };

exports.getQuestions = getQuestions;
exports.getQuestionById = getQuestionById;
exports.getQuestionsByCustomerId = getQuestionsByCustomerId;
exports.addQuestion = addQuestion;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;
