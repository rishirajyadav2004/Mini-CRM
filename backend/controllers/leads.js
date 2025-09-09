const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const ErrorResponse = require('../utils/errorResponse');
const { leadValidation } = require('../middleware/validation');

// @desc    Get all leads for a customer
// @route   GET /api/customers/:customerId/leads
// @access  Private
exports.getLeads = async (req, res, next) => {
  try {
    // Check if customer exists and belongs to user
    const customer = await Customer.findOne({ 
      _id: req.params.customerId, 
      ownerId: req.user.id 
    });

    if (!customer) {
      return next(new ErrorResponse('Customer not found', 404));
    }

    const leads = await Lead.find({ customerId: req.params.customerId });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate({
      path: 'customerId',
      select: 'name email'
    });

    if (!lead) {
      return next(new ErrorResponse('Lead not found', 404));
    }

    // Check if user owns the customer associated with this lead
    const customer = await Customer.findOne({ 
      _id: lead.customerId, 
      ownerId: req.user.id 
    });

    if (!customer) {
      return next(new ErrorResponse('Not authorized to access this lead', 401));
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create lead for a customer
// @route   POST /api/customers/:customerId/leads
// @access  Private
exports.createLead = async (req, res, next) => {
  try {
    // Validate data
    const { error } = leadValidation(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    // Check if customer exists and belongs to user
    const customer = await Customer.findOne({ 
      _id: req.params.customerId, 
      ownerId: req.user.id 
    });

    if (!customer) {
      return next(new ErrorResponse('Customer not found', 404));
    }

    // Add customerId to req.body
    req.body.customerId = req.params.customerId;

    const lead = await Lead.create(req.body);

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res, next) => {
  try {
    // Validate data
    const { error } = leadValidation(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(new ErrorResponse('Lead not found', 404));
    }

    // Check if user owns the customer associated with this lead
    const customer = await Customer.findOne({ 
      _id: lead.customerId, 
      ownerId: req.user.id 
    });

    if (!customer) {
      return next(new ErrorResponse('Not authorized to update this lead', 401));
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(new ErrorResponse('Lead not found', 404));
    }

    // Check if user owns the customer associated with this lead
    const customer = await Customer.findOne({ 
      _id: lead.customerId, 
      ownerId: req.user.id 
    });

    if (!customer) {
      return next(new ErrorResponse('Not authorized to delete this lead', 401));
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get leads by status
// @route   GET /api/leads/status/:status
// @access  Private
exports.getLeadsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    
    // Get all customers owned by user
    const customers = await Customer.find({ ownerId: req.user.id });
    const customerIds = customers.map(customer => customer._id);
    
    const leads = await Lead.find({ 
      customerId: { $in: customerIds },
      status: status 
    }).populate({
      path: 'customerId',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (err) {
    next(err);
  }
};