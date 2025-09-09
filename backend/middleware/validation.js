const Joi = require('joi');

// Register validation
exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin')
  });
  
  return schema.validate(data);
};

// Login validation
exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  
  return schema.validate(data);
};

// Customer validation
exports.customerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(20),
    company: Joi.string().max(50)
  });
  
  return schema.validate(data);
};

// Lead validation
exports.leadValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().max(500),
    status: Joi.string().valid('New', 'Contacted', 'Converted', 'Lost'),
    value: Joi.number().min(0),
    customerId: Joi.string().required()
  });
  
  return schema.validate(data);
};