const FollowRequest = require("../models/FollowRequest");
import { Request, Response } from "express";

// @route   POST api/followRequests
// @desc    Create follow request
// @access  Private
const createFollowRequest = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const receiverId = req.body.receiverId;

  const newFollowRequest = new FollowRequest({
    sender: userId,
    receiver: receiverId,
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
const getFollowRequests = async (req: Request, res: Response) => {
  try {
    const receiverId = req.user?.id;
    const followRequests = await FollowRequest.find({
      receiver: receiverId
    }).populate("sender");
    res.status(200).json(followRequests);
  } catch (err) {
    res.status(500).json(err);
  }
};

// @route   PUT api/followRequests/:id
// @desc    Update follow request
// @access  Private
const updateFollowRequest = async (req: Request, res: Response) => {
  try {
    const followRequest = await FollowRequest.findById(req.params.id);
    const userId = req.user?.id;
    if (followRequest.receiver.toString() === userId) {
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
const deleteFollowRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const followRequest = await FollowRequest.findById(req.params.id);
    if (followRequest.sender.toString() === userId) {
      await followRequest.deleteOne();
      res.status(200).json("Follow request has been deleted");
    } else {
      res.status(403).json("You can delete only your follow request");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export { createFollowRequest, getFollowRequests, updateFollowRequest, deleteFollowRequest };