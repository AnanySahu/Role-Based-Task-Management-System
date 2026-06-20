const router = require("express").Router();
const {createProject,getWorkspaceProjects}=require("../controllers/projectController");
const authMiddleware=require("../middleware/authMiddleware");
router.post("/", authMiddleware, createProject);

router.get("/workspace/:workspaceId", authMiddleware, getWorkspaceProjects);

router.get("/:projectId", authMiddleware, getProject);

// router.put("/:projectId", authMiddleware, updateProject);

// router.delete("/:projectId", authMiddleware, deleteProject);

module.exports = router;