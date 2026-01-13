import express from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication and admin access
router.use(protect);
router.use(adminOnly);

router.route("/users")
    .get(getAllUsers)
    .post(createUser);

router.route("/users/:id")
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

export default router;
