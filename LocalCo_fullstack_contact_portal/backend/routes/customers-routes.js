const express = require("express");
const { check } = require("express-validator");

const customersControllers = require("../controllers/customers-controllers");

const router = express.Router();

router.get("/", customersControllers.getCustomers);

router.get("/:cid", customersControllers.getCustomerById);

router.get("/email/:cemail", customersControllers.getCustomerByEmail);

router.get("/email/check/:cemail", customersControllers.checkCustomerExistsByEmail);

router.post(
  "/add",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phone").isLength({ min: 10, max: 10 }),
    check("newsletter").isBoolean(),
  ],
  customersControllers.addCustomer
);

router.patch(
  "/:cid",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phone").isLength({ min: 10, max: 10 }),
    check("newsletter").isBoolean(),
  ],
  customersControllers.updateCustomer
);

router.delete("/:cid", customersControllers.deleteCustomer);

module.exports = router;
