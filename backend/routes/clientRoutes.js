const router = require("express").Router();
const { authMiddleware } = require("../middleware/auth");
const {
  createClient, getClients, getClient, updateClient, deleteClient
} = require("../controllers/clientController");

router.use(authMiddleware);

router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
