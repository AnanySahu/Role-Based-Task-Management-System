const Project = require("../model/projectSchema");
const Workspace = require("../model/Workspace");
const User = require("../model/User");
const createProject = async (req, res) => {
    try {
        const { name, workspaceId, description } = req.body;
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace does not exist" });
        }
        const isMember = workspace.owner.toString() === req.user.userId ||
            workspace.members.some(
                member => member.toString() === req.user.userId
            );
        if (!isMember) {
            return res.status(403).json({ message: "Access denied" });
        }
        const project = await Project.create({
            name,
            description,
            workspace: workspaceId,
            createdBy: req.user.userId
        });
        await project.populate([
            {
                path: "workspace",
                select: "name"
            },
            {
                path: "createdBy",
                select: "name email"
            }
        ]);
        res.status(201).json({
            message: "Project created successfully",
            project
        });
    }
    catch (err) {
         res.status(500).json({
            message: err.message,
        });
    }
};
const getWorkspaceProjects=async (req,res)=>{
    try{
       const {workspaceId}=req.params;
       const workspace=await Workspace.findById(workspaceId);
       if(!workspace){
        return res.status(400).json({message:"Workspace not exists"})
       }
       const ismember=((workspace.member.includes(m=>m.toString()===req.user.userId.toString())) || (workspace.owner.toString()===req.user.userId.toString()));
       if(!ismember){
        return res.status(403).json({message:"not authorized"});
       }
       const projects=await Project.find({workspace:workspaceId});
       return res.status(200).json(projects);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
module.exports={
    createProject,
    getWorkspaceProjects
}