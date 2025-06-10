const router = require("express").Router();
const { register, login , getUsers, loginGoogle } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.post("/api/auth/google", loginGoogle);

module.exports = router;
