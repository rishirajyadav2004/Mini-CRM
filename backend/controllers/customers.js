const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const ErrorResponse = require('../utils/errorResponse');
const { customerValidation } = require('../middleware/validation');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Customer.countDocuments({ ownerId: req.user.id });

    // Search functionality
    let query = { ownerId: req.user.id };
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: customers.length,
      pagination,
      data: customers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ 
      _id: req.params.id, 
      ownerId: req.user.id 
    }).populate({
      path: 'leads',
      select: 'title description status value createdAt'
    });

    if (!customer) {
      return next(new ErrorResponse('Customer not found', 404));
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res, next) => {
  try {
    // Validate data
    const { error } = customerValidation(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    // Add user to req.body
    req.body.ownerId = req.user.id;

    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res, next) => {
  try {
    // Validate data
    const { error } = customerValidation(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return next(new ErrorResponse('Customer not found', 404));
    }

    // Make sure user owns the customer
    if (customer.ownerId.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this customer', 401));
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return next(new ErrorResponse('Customer not found', 404));
    }

    // Make sure user owns the customer
    if (customer.ownerId.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this customer', 401));
    }

    // Delete all leads associated with this customer
    await Lead.deleteMany({ customerId: req.params.id });

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};