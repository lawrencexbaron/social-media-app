const FollowRequest = require("../models/FollowRequest");

// @route   POST api/followRequests
// @desc    Create follow request
// @access  Private
const createFollowRequest = async (req, res) => {
  const newFollowRequest = new FollowRequest({
    sender: req.user._id,
    receiver: req.body.receiverId,
  });

  try {
    const savedFollowRequest = await newFollowRequest.save();
    res.status(200).json(savedFollowRequest);
  } catch (err) {
    res.status(500).json(err);
  }
};

// @route   GET api/followRequests
// @desc    Get all follow requests
// @access  Private
const getFollowRequests = async (req, res) => {
  try {
    const followRequests = await FollowRequest.find({
      receiver: req.user._id,
    }).populate("sender");
    res.status(200).json(followRequests);
  } catch (err) {
    res.status(500).json(err);
  }
};

// @route   PUT api/followRequests/:id
// @desc    Update follow request
// @access  Private
const updateFollowRequest = async (req, res) => {
  try {
    const followRequest = await FollowRequest.findById(req.params.id);
    if (followRequest.receiver.toString() === req.user._id.toString()) {
      await followRequest.updateOne({ $set: req.body });
      res.status(200).json("Follow request has been updated");
    } else {
      res.status(403).json("You can update only your follow request");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// @route   DELETE api/followRequests/:id
// @desc    Delete follow request
// @access  Private
const deleteFollowRequest = async (req, res) => {
  try {
    const followRequest = await FollowRequest.findById(req.params.id);
    if (followRequest.sender.toString() === req.user._id.toString()) {
      await followRequest.deleteOne();
      res.status(200).json("Follow request has been deleted");
    } else {
      res.status(403).json("You can delete only your follow request");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createFollowRequest,
  getFollowRequests,
  updateFollowRequest,
  deleteFollowRequest,
};
