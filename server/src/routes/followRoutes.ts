const express = require("express");

const router = express.Router();

import { createFollowRequest, getFollowRequests, updateFollowRequest, deleteFollowRequest } from "../controller/RequestController";

import validateJwtToken from "../utilities/validateToken";

// @route   POST api/followRequests
// @desc    Create follow request
// @access  Private
router.post("/", validateJwtToken, createFollowRequest);

// @route   GET api/followRequests
// @desc    Get all follow requests
// @access  Private
router.get("/", validateJwtToken, getFollowRequests);

// @route   PUT api/followRequests/:id
// @desc    Update follow request
// @access  Private
router.put("/:id", validateJwtToken, updateFollowRequest);

// @route   DELETE api/followRequests/:id
// @desc    Delete follow request
// @access  Private
router.delete("/:id", validateJwtToken, deleteFollowRequest);

export default router;