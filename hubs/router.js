const express = require("express");

const Hubs = require("./hubs-model.js"); // update the path

const router = express.Router();

// handles every request that begins with /api/hubs
router.get("/", (req, res) => {
  Hubs.find(req.query)
    .then((hubs) => {
      res.status(200).json({ queryString: req.query, hubs });
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the hubs",
      });
    });
});

router.get("/:id", (req, res) => {
  Hubs.findById(req.params.id)
    .then((hub) => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: "Hub not found" });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the hub",
      });
    });
});

router.post("/", (req, res) => {
  Hubs.add(req.body)
    .then((hub) => {
      res.status(201).json(hub);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error adding the hub",
      });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Hubs.remove(id)
    .then((count) => {
      if (count) {
        res.status(200).json({ message: "hub deleted" });
      } else {
        res.status(404).json({ message: "hub not found" });
      }
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: "something failed, sorry" });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;

  console.log("changes:", changes);

  Hubs.update(req.params.id, changes)
    .then((count) => {
      if (count) {
        Hubs.findById(req.params.id)
          .then((hub) => {
            res.status(200).json(hub);
          })
          .catch((err) => {
            res
              .status(500)
              .json({ errorMessage: "error reading the updated hub" });
          });
      } else {
        res.status(404).json({ message: "The hub could not be found" });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error updating the hub",
      });
    });
});

// add an endpoint that returns all the messages for a hub
// /api/hubs/:id/messages
router.get("/:id/messages", (req, res) => {
  Hubs.findHubMessages(req.params.id)
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "error reading messages" });
    });
});

// add an endpoint for adding new message to a hub
router.post("/:id/messages", (req, res) => {
  Hubs.addMessage(req.body)
    .then((message) => {
      res.status(201).json(message);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "error adding messages" });
    });
});

module.exports = router; // make it available for require()

// REMEMBER THE "S" on exports

// router.route("/").post().get();

// router.route("/:id").put().delete();
