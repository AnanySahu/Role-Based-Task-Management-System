const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

router.get("/profile",authMiddleware,(req, res) => {

    res.json({
      message: "Protected Route",
      user: req.user
    });

  }
);
router.get("/manager-only",authMiddleware,roleMiddleware("manager","admin"),(req,res)=>{
    res.json({
      message:
      "Welcome Manager/Admin"
    });
});

module.exports = router;