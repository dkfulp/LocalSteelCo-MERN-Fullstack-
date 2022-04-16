const express = require("express");
const { check } = require("express-validator");

const staffController = require("../controllers/staff-controllers");

const router = express.Router();

router.get("/", staffController.getStaff);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  staffController.signup
);

router.post("/login", staffController.login);

module.exports = router;
