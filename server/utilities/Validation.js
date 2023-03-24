const Joi = require("joi");

// Base options for all schemas
const baseOptions = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
  errors: {
    wrap: {
      label: "",
    },
  },
};

// User validation schema
const registerValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(20).required().messages({
      "string.empty": `First name is required`,
      "string.required": "First name is required",
      "any.required": "First name is required",
      "string.min": `First name should have a minimum length of {#limit}`,
    }),
    lastname: Joi.string().min(3).max(20).required().messages({
      "string.empty": `Last name is required`,
      "string.required": "Last name is required",
      "any.required": "Last name is required",
      "string.min": `Last name should have a minimum length of {#limit}`,
    }),
    username: Joi.string().min(3).max(20).required().messages({
      "string.empty": `Username is required`,
      "string.required": "Username is required",
      "any.required": "Username is required",
      "string.min": `Username should have a minimum length of {#limit}`,
    }),
    email: Joi.string().min(6).max(255).required().email().messages({
      "string.empty": `Email is required`,
      "string.required": "Email is required",
      "any.required": "Email is required",
      "string.min": `Email should have a minimum length of {#limit}`,
      "string.email": `Email is invalid`,
    }),
    password: Joi.string().min(6).max(1024).required().messages({
      "string.empty": `Password is required`,
      "string.required": "Password is required",
      "any.required": "Password is required",
      "string.min": `Password should have a minimum length of {#limit}`,
    }),
  });

  return schema.validate(data, baseOptions);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email().messages({
      "string.empty": `Email is required`,
      "string.required": "Email is required",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(1024).required().messages({
      "string.empty": `Password is required`,
      "string.required": "Password is required",
      "any.required": "Password is required",
      "string.min": `Password should have a minimum length of {#limit}`,
    }),
  });

  return schema.validate(data, baseOptions);
};

const postValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(3).max(255).required().messages({
      "string.empty": `Post is required`,
      "string.required": "Post is required",
      "any.required": "Post is required",
      "string.min": `Post should have a minimum length of {#limit}`,
    }),
  });

  return schema.validate(data, baseOptions);
};

const commentValidation = (data) => {
  const schema = Joi.object({
    text: Joi.string().min(3).max(255).required().messages({
      "string.empty": `Comment is required`,
      "string.required": "Comment is required",
      "any.required": "Comment is required",
      "string.min": `Comment should have a minimum length of {#limit}`,
    }),
  });

  return schema.validate(data, baseOptions);
};

const replyValidation = (data) => {
  const schema = Joi.object({
    text: Joi.string().min(3).max(255).required().messages({
      "string.empty": `Reply is required`,
      "string.required": "Reply is required",
      "any.required": "Reply is required",
      "string.min": `Reply should have a minimum length of {#limit}`,
    }),
  });

  return schema.validate(data, baseOptions);
};

module.exports = {
  registerValidation,
  loginValidation,
  postValidation,
  commentValidation,
  replyValidation,
};
