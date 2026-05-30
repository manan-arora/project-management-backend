import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().forEach((err) =>
    extractedErrors.push({
      [err.path]: err.msg, //sq brackets because key names can't directly contain dots, thus this syntax for computed property
    }),
  );

  throw new ApiError(422, "Received data is not valid", extractedErrors);
};
