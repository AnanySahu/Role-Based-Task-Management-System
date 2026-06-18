const Workspace = require("../model/Workspace");
const User = require("../model/User");
const createWorkspace =
    async (req, res) => {

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
        const { workspaceId } = req.params.workspaceId;
        const { userId } = req.body.userId;
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

    }
    catch (error) {

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
            m => m.user.toString() === userId
        );

        if (!member) {
            return res.status(404).json({
                message: "User is not a member"
            });
        }

        workspace.members = workspace.members.filter(
            m => m.user.toString() !== userId
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
        const userId = new mongoose.Types.ObjectId(req.params.userId);
        const workspaceId = req.params.workspaceId;
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(403).json({ message: "Workspace does not exist" });
        }
        if (!workspace.members.includes(userId)) {
            return res.status(402).json({ message: "userId invalid" });
        }
        await workspace.members.deleteOne("user", userId);
        return res.status(201).json({ message: "User removed successfully" });
    }
    catch (err) {

    }
}

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    addMember
};