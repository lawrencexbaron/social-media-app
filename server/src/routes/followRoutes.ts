const express = require("express");

const router = express.Router();

const {
  createFollowRequest,
  getFollowRequests,
  updateFollowRequest,
  deleteFollowRequest,
} = require("../controller/RequestController");

const validateToken = require("../utilities/validateToken");

// @route   POST api/followRequests
// @desc    Create follow request
// @access  Private
router.post("/", validateToken, createFollowRequest);

// @route   GET api/followRequests
// @desc    Get all follow requests
// @access  Private
router.get("/", validateToken, getFollowRequests);

// @route   PUT api/followRequests/:id
// @desc    Update follow request
// @access  Private
router.put("/:id", validateToken, updateFollowRequest);

// @route   DELETE api/followRequests/:id
// @desc    Delete follow request
// @access  Private
router.delete("/:id", validateToken, deleteFollowRequest);

module.exports = router;
