const router = require("express").Router();
const debug = require("debug");
const netRequest = debug("app:net:request");
const netReply = debug("app:net:reply");
const { Costumer, validate } = require("../models/Costumer");

// Get all costumers
router.get("/", async (req, res) => {
  netRequest("Call for costumers");
  const costumers = await Costumer.find().sort("name");
  netReply(costumers);
  res.send(costumers);
});

// Get specific costumer
router.get("/:id", async (req, res) => {
  netRequest(
    "Call for specific costumer: ",
    req.params.id,
    typeof req.params.id
  );
  const costumer = await Costumer.findById(req.params.id);
  netReply(costumer);
  if (!costumer) return res.status(404).send("costumer not found.");
  res.send(costumer);
});

// Add new costumer
router.post("/", async (req, res) => {
  netRequest("Call to create a new costumer", req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let costumer = req.body;
  costumer = await Costumer.create(costumer);
  netReply(costumer);
  res.send(costumer);
});

// Update costumer
router.put("/:id", async (req, res) => {
  netRequest("Call to update costumer", req.params.id, typeof req.params.id);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update and get
  let costumer = await Costumer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // get and update
  // let costumer = await Costumer.findById(req.params.id);
  // costumer = req.body;
  // const costumer = await costumer.save();
  if (!costumer) return res.status(404).send("costumer not found.");
  netReply(costumer);
  res.send(costumer);
});

// Delete costumer
router.delete("/:id", async (req, res) => {
  netRequest("Call to delete costumer", req.params.id, typeof req.params.id);
  // delete and get
  const costumer = await Costumer.findByIdAndDelete(req.params.id);
  // get and delete
  // const costumer = await Costumer.deleteOne({ _id: req.params.id });
  if (!costumer) return res.status(404).send("Costumer not found.");
  netReply(costumer);
  res.send(costumer);
});

module.exports = router;
