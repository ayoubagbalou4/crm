const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createClient, getClients, getClient, updateClient, deleteClient
} = require("../controllers/clientController");

router.use(authMiddleware);

router.post("/clients", createClient);
router.get("/clients", getClients);
router.get("/clients/:id", getClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

module.exports = router;
