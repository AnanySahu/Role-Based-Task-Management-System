const express = require("express");

const router =
express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {
  createWorkspace,getMyWorkspaces
} = require(
  "../controllers/workspaceController"
);

router.post(
  "/",

  authMiddleware,

  roleMiddleware(
      "admin",
      "manager"
  ),

  createWorkspace
);
router.get("/",authMiddleware,getMyWorkspaces);

module.exports = router;