var express = require("express");
var router = express.Router();

const Place = require("../models/place");
const { checkBody } = require("../modules/checkBody");

router.post("/places", (req, res) => {
  if (!checkBody(req.body, ["nickname", "name"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const newPlace = new Place({
    nickname: req.body.nickname,
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  newPlace.save().then((data) => {
    console.log(data);
    res.json({ result: true, newPlace: data });
  });
});

router.get("/places/:nickname", (req, res) => {
  Place.find({
    nickname: { $regex: new RegExp(req.params.nickname, "i") },
  }).then((data) => {
    res.json({ result: true, places: data });
  });
});

router.delete("/places", (req, res) => {
  if (!checkBody(req.body, ["nickname", "name"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const { nickname, name } = req.body;

  Place.deleteOne({
    nickname: { $regex: new RegExp(nickname, "i") },
    name,
  }).then((deletedDoc) => {
    deletedDoc.deletedCount > 0
      ? res.json({ result: true })
      : res.json({ result: false, error: "Place not found" });
  });
});

module.exports = router;
