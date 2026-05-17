const { DataRemovalRequest } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.requestRemoval = catchAsync(async (req, res) => {
  const { reason } = req.body;
  
  const request = await DataRemovalRequest.create({
    userId: req.user.userId,
    reason
  });
  
  res.status(201).json({ success: true, data: request });
});
