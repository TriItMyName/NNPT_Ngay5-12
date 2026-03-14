const mongoose = require("mongoose");
const Role = require("../models/rolemodel");
const User = require("../models/usermodel");

const handleServerError = (res, error) =>
  res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });

const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    return res.status(201).json(role);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Role name already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return handleServerError(res, error);
  }
};

const getAllRoles = async (_req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false }).sort({ createdAt: -1 });
    return res.json(roles);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role id" });
    }

    const role = await Role.findOne({ _id: id, isDeleted: false });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json(role);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role id" });
    }

    const role = await Role.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json(role);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Role name already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return handleServerError(res, error);
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role id" });
    }

    const role = await Role.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json({ message: "Role deleted successfully" });
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getUsersByRoleId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role id" });
    }

    const role = await Role.findOne({ _id: id, isDeleted: false });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const users = await User.find({ role: id, isDeleted: false })
      .populate("role")
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (error) {
    return handleServerError(res, error);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getUsersByRoleId,
};