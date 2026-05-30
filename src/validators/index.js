import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .isEmail()
            .withMessage("Email is required"),
        
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .toLowerCase()
            .isLength({min: 3})
            .withMessage("Username must be atleast 3 characters long"),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required"),

        body("fullName")
            .optional()
            .trim(),
    ]
};

export { userRegisterValidator };
