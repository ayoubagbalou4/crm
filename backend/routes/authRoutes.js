const router = require("express").Router();
const { register, login, getUsers, loginGoogle } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.post("/api/auth/google", loginGoogle);

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (err) {
        console.error("Error getting user:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
