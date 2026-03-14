const mongoose = require("mongoose");
const User = require("../models/usermodel");
const Role = require("../models/rolemodel");

const handleServerError = (res, error) =>
  res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });

const createUser = async (req, res) => {
  try {
    const { role } = req.body;

    if (role) {
      const roleExists = await Role.findOne({ _id: role, isDeleted: false });

      if (!roleExists) {
        return res.status(400).json({ message: "Role does not exist" });
      }
    }

    const user = await User.create(req.body);
    const populatedUser = await user.populate("role");
    return res.status(201).json(populatedUser);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      return res.status(409).json({ message: `${duplicateField} already exists` });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    return handleServerError(res, error);
  }
};

const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .populate("role")
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findOne({ _id: id, isDeleted: false }).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (role) {
      const roleExists = await Role.findOne({ _id: role, isDeleted: false });

      if (!roleExists) {
        return res.status(400).json({ message: "Role does not exist" });
      }
    }

    const user = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      return res.status(409).json({ message: `${duplicateField} already exists` });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    return handleServerError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return handleServerError(res, error);
  }
};

const enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "email and username are required" });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase(), username, isDeleted: false },
      { status: true },
      { new: true }
    ).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found or information is incorrect" });
    }

    return res.json({ message: "User enabled successfully", user });
  } catch (error) {
    return handleServerError(res, error);
  }
};

const disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "email and username are required" });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase(), username, isDeleted: false },
      { status: false },
      { new: true }
    ).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found or information is incorrect" });
    }

    return res.json({ message: "User disabled successfully", user });
  } catch (error) {
    return handleServerError(res, error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  enableUser,
  disableUser,
};