const express = require("express");
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getUsersByRoleId,
} = require("../controllers/rolecontroller");

const router = express.Router();

router.post("/", createRole);
router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);
router.get("/:id/users", getUsersByRoleId);

module.exports = router;