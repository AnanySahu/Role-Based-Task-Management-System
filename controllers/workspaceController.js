const Workspace = require("../model/Workspace");
const User = require("../model/User");
const createWorkspace =async (req, res) => {

        try {

            const { name, description } = req.body;

            const workspace = await Workspace.create({
                name,
                description,
                owner: req.user.userId,
                members: [
                    req.user.userId
                ]
            });

            res.status(201).json(
                workspace
            );

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }
};
const getMyWorkspaces = async (req, res) => {
    try {

        const workspaces = await Workspace.find({
            members: req.user.userId
        })
            .populate("owner", "name email")
            .populate("members", "name email");

        res.status(200).json(workspaces);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const addMember = async (req, res) => {

    try {
        const { workspaceId } = req.params;
        const { userId } = req.body;
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }
        if (workspace.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Only the workspace owner can add members."
            });
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        const updatedWorkspace = await Workspace.findByIdAndUpdate(

            workspaceId,

            {
                $addToSet: {
                    members: userId
                }
            },

            {
                new: true
            }

        ).populate(
            "members",
            "name email"
        );
         return res.status(200).json(updatedWorkspace);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });

    }

};
const removeMember = async (req, res) => {
    try {
        const { workspaceId, userId } = req.params;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        const member = workspace.members.find(
            m => m.toString() === userId
        );

        if (!member) {
            return res.status(404).json({
                message: "User is not a member"
            });
        }

        workspace.members = workspace.members.filter(
            m => m.toString() !== userId
        );

        await workspace.save();

        res.json({
            message: "User removed successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
const changeRoleOfMember = async (req, res) => {
    try {
        const { userId, workspaceId } = req.params;
        const workspace = await Workspace.findById(workspaceId);
        const member = workspace.members.find(
            member => member.toString() === userId.toString()
        );
        if (!member) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        member.role = req.body.role;
        await workspace.save();
        res.json({
            message: "Role updated successfully"
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    addMember,
    removeMember,
    changeRoleOfMember
};