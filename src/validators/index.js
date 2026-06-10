import { body } from "express-validator";
import { AvailableTaskStatuses, AvailableUserRoles } from "../utils/constants.js";

const userRegisterValidator = () => {
  return [
    body("email").trim().notEmpty().isEmail().withMessage("Email is required"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .toLowerCase()
      .isLength({ min: 3 })
      .withMessage("Username must be atleast 3 characters long"),

    body("password").trim().notEmpty().withMessage("Password is required"),

    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").notEmpty().isEmail().withMessage("Email is required"),

    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old Password is required"),

    body("newPassword").notEmpty().withMessage("New Password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRoles)
      .withMessage("Role is invalid"),
  ];
};

const createTaskValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional(),
    body("assignedTo").notEmpty().withMessage("Assignee is required"),
    body("status").optional(),
  ]
}

const updateTaskValidator = () => {
  return [
    body("title").optional(),
    body("description").optional(),
    body("assignedTo").optional(),
    body("status")
    .optional()
    .isIn(AvailableTaskStatuses),
  ]
}

const createSubTaskValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("isCompleted").optional(),
  ]
}

const updateSubTaskValidator = () => {
  return [
    body("title").optional(),
    body("isCompleted").optional(),
  ]
}

const createNoteValidator = () => {
  return [
    body("content").notEmpty().withMessage("Content is required"),
  ];
};

const updateNoteValidator = () => {
  return [
    body("content").notEmpty().withMessage("Content is required"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
  createNoteValidator,
  updateNoteValidator,
};
