import { ApiResponse } from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";

/*
const healthCheck = (req, res) =>{ //actual function/logic
    try {
        res
        .status(200)
        .json(new ApiResponse(200,"Some data", { message: "Server is running"}))
    } catch (err) {
        next(err)
    }
}
    */

const healthCheck = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(200, "Sample data", { message: "Server is running" }),
    );
});

export { healthCheck };
