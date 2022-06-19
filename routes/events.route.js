const express = require("express");
const router = express.Router();

// Load Controllers
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllevents,
} = require("../controllers/events.controller");

const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");

router.post("/admin/create/event", requireSignin, adminMiddleware, createEvent);
router.put(
  "/admin/update/event/:id",
  requireSignin,
  adminMiddleware,
  updateEvent
);
router.delete(
  "/admin/delete/event/:id",
  requireSignin,
  adminMiddleware,
  deleteEvent
);
router.get("/events", getAllevents);

module.exports = router;
