const express = require("express");
const { check } = require("express-validator");

const questionsControllers = require("../controllers/questions-controllers");

const router = express.Router();

router.get("/", questionsControllers.getQuestions);

router.get("/:qid", questionsControllers.getQuestionById);

router.get("/customer/:cid", questionsControllers.getQuestionsByCustomerId);

router.post(
  "/add",
  [
    check("submitted").not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  questionsControllers.addQuestion
);

router.patch(
  "/:qid",
  [
    check("description").isLength({ min: 5 }),
  ],
  questionsControllers.updateQuestion
);

router.delete("/:qid", questionsControllers.deleteQuestion);

module.exports = router;
