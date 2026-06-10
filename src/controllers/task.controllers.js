import { User } from "../models/user.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { Project } from "../models/project.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    status: status || undefined,
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const taskDetails = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!taskDetails || taskDetails.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, taskDetails, "Task Details fetched successfully"),
    );
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { taskId, projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(taskId),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      title,
      description,
      assignedTo: assignedTo
        ? new mongoose.Types.ObjectId(assignedTo)
        : undefined, //mongoose ignores undefined fields during update, so it won't overwrite with empty
      status,
    },
    {
      new: true,
    },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const addTaskAttachments = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(taskId),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      $push: {
        attachments: {
          $each: attachments,
        },
      },
    },
    {
      new: true,
    },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Attachments added successfully"));
});

const deleteTaskAttachment = asyncHandler(async (req, res) => {
  const { taskId, projectId, attachmentId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(taskId),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      $pull: {
        attachments: {
          _id: new mongoose.Types.ObjectId(attachmentId),
        },
      },
    },
    {
      new: true,
    },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        task,
        "Attachment deleted successfully",
      ),
    );
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const deletedTask = await Task.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!deletedTask) {
    throw new ApiError(404, "Task not found");
  }

  await Subtask.deleteMany({
    task: deletedTask._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title, isCompleted } = req.body;
  const { projectId, taskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
  });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtask = await Subtask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    isCompleted,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { projectId, subTaskId } = req.params;
  const { title, isCompleted } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const subtask = await Subtask.findById(subTaskId);
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const task = await Task.findOne({
    _id: subtask.task,
    project: projectId,
  });

  if (!task) {
    throw new ApiError(404, "Subtask does not belong to this project");
  }

  const updatedSubtask = await Subtask.findByIdAndUpdate(
    subTaskId,
    {
      title,
      isCompleted,
    },
    {
      new: true,
    },
  );

  if (!updatedSubtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubtask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { projectId, subTaskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const subtask = await Subtask.findById(subTaskId);
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const task = await Task.findOne({
    _id: subtask.task,
    project: projectId,
  });

  if (!task) {
    throw new ApiError(404, "Subtask does not belong to this project");
  }

  const deletedSubtask = await Subtask.findByIdAndDelete(subTaskId);

  if (!deletedSubtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedSubtask, "SubTask deleted successfully"));
});

export {
  createTask,
  createSubTask,
  updateTask,
  addTaskAttachments,
  deleteTaskAttachment,
  updateSubTask,
  deleteTask,
  deleteSubTask,
  getTasks,
  getTaskById,
};
