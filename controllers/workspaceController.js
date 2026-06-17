const Workspace =require("../model/Workspace");

const createWorkspace =
async (req,res)=>{

    try{

        const { name, description} = req.body;

        const workspace =await Workspace.create ({
            name,
            description,
            owner:req.user.userId,
            members:[
                req.user.userId
            ]
        });

        res.status(201).json(
            workspace
        );

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }
};

module.exports = {
    createWorkspace
};