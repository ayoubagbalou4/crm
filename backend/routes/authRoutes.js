const router = require("express").Router();
const { register, login, getUsers, logout , loginGoogle , generateFromSubmit , updateProfile , updatePassword , updatePicture } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require('../middleware/upload');
const User = require("../models/User");


router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.post("/forms", authMiddleware , generateFromSubmit);
router.post('/logout', logout)
router.post("/api/auth/google", loginGoogle);
router.put('/profile', authMiddleware , updateProfile)
router.put('/password', authMiddleware , updatePassword)
router.post('/profile/picture', upload.single('picture') , authMiddleware , updatePicture)

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
