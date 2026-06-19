const express = require("express");

const router =express.Router();

const authMiddleware =require("../middleware/authMiddleware");

const roleMiddleware =require("../middleware/roleMiddleware");

const {createWorkspace,getMyWorkspaces,addMember,removeMember,changeRoleOfMember} = require("../controllers/workspaceController"
);

router.post( "/",authMiddleware,roleMiddleware( "admin","manager"),createWorkspace);
router.get("/",authMiddleware,getMyWorkspaces);
router.post("/:workspaceId/members",authMiddleware,roleMiddleware("manager"), addMember);
router.delete("/:workspaceId/members/:userId",authMiddleware,roleMiddleware("admin","manager"),removeMember);
router.patch("/:workspaceId/members/:userId",authMiddleware,roleMiddleware("admin","manager"),changeRoleOfMember);
module.exports = router;