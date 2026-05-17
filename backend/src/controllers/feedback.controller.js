const { Feedback } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.submitFeedback = catchAsync(async (req, res) => {
  const { type, title, description } = req.body;
  
  const feedback = await Feedback.create({
    userId: req.user.userId,
    type: type || 'suggestion',
    title,
    description
  });
  
  res.status(201).json({ success: true, data: feedback });
});
