const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");

const {
  getBalance,
  getStatement,
  transfer,
} = require("../controllers/accountController");

router.get("/balance", auth, getBalance);
router.get("/statement", auth, getStatement);
router.post("/transfer", auth, transfer);

module.exports = router;
