

import mongoose from "mongoose";
import Project from "../models/Project.js";
import User from "../models/User.js";
/**
 * @desc Create a new project
 * @route POST /api/projects
 * @access Admin | Manager
 */

export const createProject = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let assignedIds = [];
    if (assignedTo && Array.isArray(assignedTo)) {
      for (const item of assignedTo) {
        if (/^[0-9a-fA-F]{24}$/.test(item)) {
          // valid ObjectId
          assignedIds.push(item);
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item)) {
          // looks like an email
          const user = await User.findOne({ email: item.trim() });
          if (!user) {
            return res.status(404).json({ message: `User with email ${item.trim()} not found` });
          }
          assignedIds.push(user._id);
        }
      }
    }

    const project = await Project.create({
      title,
      description,
      status: status || "pending",
      createdBy: req.user._id,
      assignedTo: assignedIds,
      priority,
      dueDate,
      manager: req.user._id,
    });

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};



/**
 * @desc Get all projects (with optional search, status filter & pagination)
 * @route GET /api/projects
 * @access Admin
 */
export const getAllProjects = async (req, res) => {
  try {
    const { status, search = "", page = 1, limit = 10 } = req.query;

    const query = {};

    // ✅ filter by status
    if (status) query.status = status;

    // ✅ search by title or description (case-insensitive)
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      projects,
    });
  } catch (err) {
    console.error("Get All Projects Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Get projects assigned to the logged-in user
 * @route GET /api/projects/my
 * @access Logged-in User
 */


export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id },
      ],
    })
      .populate({
        path: "tasks", // virtual populate
        select: "title status assignee createdAt",
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    console.error("GetMyProjects error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Update a project (title, description, status, assignedTo)
 * @route PUT /api/projects/:id
 * @access Admin | Manager
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const fields = ["title", "description", "status", "assignedTo","priority"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    const updated = await project.save();
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update Project Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Delete a project
 * @route DELETE /api/projects/:id
 * @access Admin
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    await project.deleteOne();
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete Project Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getManagerProjects = async (req,res)=>{
  try{
    const { page =1 , limit = 10 , status, search=""}=req.query;
    const query = { manager:req.user._id, archived:false};

    if(status) query.status= status;
    if(search.trim()){
      query.$text = { $search:search}; // uses the text index
    }
   const total = await Project.countDocuments(query);
   const projects = await Project.find(query)
   .populate("assignedTo","name email")
   .sort({createdAt:-1})
   .skip((page - 1) * limit)
   .limit(parseInt(limit));
  res.json({success:true, total, page:parseInt(page),projects});




  }catch(err){
    console.error(err);
    res.status(500).json({success:false, message:"server error"});

  }
};


export const getProjectById  = async (req,res)=>{
  try{
    const project = await Project.findById(req.params.id)
    .populate("assignedTo","name email")
    .populate("manager" , "name email")
    .populate("createdBy","name email");

    if(!project) return res.status(404).json({success:false,message:"Not found"});
    
    //If admin => ok , if manager => ensure thay own , if user => ensure assisgned 

   if(req.user.role==="admin") return res.json({success:true, project});

   if (req.user.role==="manager" && project.manager && project.manager.equals(req.user._id)) {
     return res.json({success:true, project});


   } 

   if(req.user.role==="user" && project.assignedTo.some((a)=>a.equals(req.user._id))){
    return res.json({success:true,project});

   }

   return res.status(403).json({success:false,message:"Forbidden "})


  }catch(err){
    console.error(err);
    res.status(500).json({success:true,message:"Server error"})
  }
};

export const updateProjectByManager = async (req,res)=>{
  try{
    const project = req.project;
    const allowed =["title","description","status","priority", "dueDate","assignedTo"];
    allowed.forEach((f)=>{
      if(req.body[f] !== undefined) project[f] = req.body[f];

    });
    await project.save();
    await project.populate("assignedTo","name email");
    res.json({success:true, data:project});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false , message:"server error"});

  }
};

/**
 * @desc Assign or remove users from a project
 * @route PATCH /api/projects/:id/assign
 * @access Admin | Manager
 */


export const assignUsers = async (req,res)=>{
  try{
    const {id}=req.params;
    let {assignedTo}=req.body;

    if(!Array.isArray(assignedTo)){
      return res.status(400).json({message:"AssignedTo must be an array "});

    }

    //Resolve any emails => user ID's
    const resolveIds=[];
    for(const item of assignedTo){
      if(/^[0-9a-fA-F]{24}$/.test(item)){
        // valid objectId
        resolveIds.push(item);
      }else if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item)){
        //looks like an email

        const user= await User.findOne({email:item.trim()});
        if(!user){
          return res.status(404).json({message:`User with email ${item.trim()}`});

        }
        resolveIds.push(user._id);
      }
    }

    //update project'
    const project = await Project.findById(id);
    if(!project) return res.status(404).json({message:"Project npt found"});

    project.assignedTo=resolveIds;
    await project.save();

    //populate memebers for client

    const populated= await project.polpulate("assignedTo","name email role");

    res.json({
      message:"Members updated successfully",
      assignedTo:populated.assignedTo,

    });
  }catch(error){
    console.error("Assign  users error:".error);
    res.status(500).json({message:"Server error while assigning users"})
  }
};

//end new code 

export const addComment = async (req, res) => {
  try {
    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // permission: admin OR manager(owner) OR assigned user
    const can =
      req.user.role === "admin" ||
      (req.user.role === "manager" && project.manager?.equals(req.user._id)) ||
      (req.user.role === "user" && project.assignedTo.some((id) => id.equals(req.user._id)));

    if (!can) return res.status(403).json({ success: false, message: "Forbidden" });

    project.comments.push({ user: req.user._id, text: req.body.text });
    await project.save();

    const populated = await Project.populate(
      project.comments[project.comments.length - 1],
      { path: "user", select: "name email" }
    );

    res.status(201).json({ success: true, comment: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isManager =
      req.user.role === "manager" &&
      project.manager &&
      project.manager.toString() === req.user._id.toString();

    if (!isAdmin && !isManager) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const index = project.comments.findIndex(
      (c) => c._id.toString() === commentId
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    project.comments.splice(index, 1);
    await project.save();

    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error("Delete Comment Error:", err.message, err.stack);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


// controllers/projectController.js
export const addTask = async (req, res) => {
  try {
    // 1️⃣ Ensure the project was set by the middleware
    const project = req.project;
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found or not attached to request" });
    }

    // 2️⃣ Validate body fields
    const { title, description, assignee, dueDate } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Task title is required" });
    }

    // 3️⃣ Make sure tasks array exists
    if (!Array.isArray(project.tasks)) {
      project.tasks = [];
    }

    // 4️⃣ Push new task
    const task = {
      title,
      description,
      assignee,
      dueDate,
    };

    project.tasks.push(task);
    await project.save();

    // 5️⃣ Return the newly added task
    const newTask = project.tasks[project.tasks.length - 1];
    res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    console.error("Add Task Error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * @desc Get all users that a Manager/Admin can assign
 * @route GET /api/projects/for-manager
 * @access Admin | Manager
 */
export const getAllUsersForManager = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const users = await User.find(
      { role: { $in: ["user", "admin"] } },
      "name email role"
    );

    res.json({ success: true, users });
  } catch (err) {
    console.error("getAllUsersForManager:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

