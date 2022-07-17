const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllevents,
} = require("../controllers/events.controller");

router.post(
  "/admin/create/event",
  isAuthenticatedUser,
  authorizeRoles,
  createEvent
);
router.put(
  "/admin/update/event/:id",
  isAuthenticatedUser,
  authorizeRoles,
  updateEvent
);
router.delete(
  "/admin/delete/event/:id",
  isAuthenticatedUser,
  authorizeRoles,
  deleteEvent
);
router.get("/events", getAllevents);

module.exports = router;
