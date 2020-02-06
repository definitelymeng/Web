import express from "express";
import { parseGet } from "../middlewares/parse_get";
import { parsePost } from "../middlewares/parse_post";
import { parseDelete } from "../middlewares/parse_delete";
import { authenticateUser } from "../middlewares/auth";

const fetch = require("node-fetch");

export const router = express.Router();
export const prefix = "/private";

const { privateStore } = require("../data/DataStore");

/**
 * Every request to this route needs
 * to be made from an authenticated user.
 */
router.use(authenticateUser);

router.get("/", parseGet, function(req, res) {
  const result = req.handleGet(privateStore);
  if (typeof result !== "undefined") {
    res.send(privateStore["_data"]["playlists"]);
  }
});

router.get("/search", parseGet, function(req, res) {
  const result = req.handleGet(privateStore);
  console.log(req.query);
  const _term = req.query.term;
  const _suggestion = new Array();
  for (let i in privateStore["_data"]["playlists"]) {
    let toUpper = privateStore["_data"]["playlists"][i]["name"].toUpperCase();
    let UpperTerm = _term.toUpperCase();
    let _index = toUpper.indexOf(UpperTerm);
    if (_index !== -1) {
      _suggestion.push(privateStore["_data"]["playlists"][i]["name"]);
    }
  }
  if (typeof result !== "undefined") {
    res.send({ _suggestion });
  }
});

router.post("/like", parsePost, function(req, res) {
  const _id = req.body.data.id;
  const _user = req.body.data.user;
  const result = req.handlePost(privateStore);
  let playlists = privateStore["_data"]["playlists"];
  for (let i in playlists) {
    if (playlists[i]["id"] == _id) {
      console.log(playlists[i]["likes"]);
      console.log(typeof playlists[i]["likes"]);
      if (playlists[i]["likes"].includes(_user)) {
        res.sendStatus(404);
      } else {
        playlists[i]["likes"].push(_user);
        privateStore.set("playlists", playlists);
        const toReturn = {};
        toReturn[_id] = playlists[i]["likes"].length;
        res.send(toReturn);
        break;
      }
    }
  }
});

router.post("/unlike", parsePost, function(req, res) {
  const _id = req.body.data.id;
  const _user = req.body.data.user;
  const result = req.handlePost(privateStore);
  let playlists = privateStore["_data"]["playlists"];
  for (let i in playlists) {
    if (playlists[i]["id"] == _id) {
      if (playlists[i]["likes"].includes(_user)) {
        let _index = playlists[i]["likes"].indexOf(_user);
        playlists[i]["likes"].splice(_index, 1);
        privateStore.set("playlists", playlists);
        const toReturn = {};
        toReturn[_id] = playlists[i]["likes"].length;
        res.send(toReturn);
        break;
      } else {
        res.sendStatus(403);
      }
    }
  }
});

router.post("/comment", parsePost, function(req, res) {
  const result = req.handlePost(privateStore);
  let playlists = privateStore["_data"]["playlists"];
  const _comment = {
    user: req.body.data.user,
    body: req.body.data.body,
    id: Math.floor(Math.random() * 10000000 + 1)
  };
  const _targetid = req.body.data.targetid;
  for (let i in playlists) {
    if (playlists[i]["id"] == _targetid) {
      playlists[i]["comments"].push(_comment);
      privateStore.set("playlists", playlists);
      const toReturn = {};
      toReturn[_comment["id"]] = "OK";
      res.send(toReturn);
      break;
    }
  }
});

router.delete("/comment", parsePost, function(req, res) {
  const result = req.handlePost(privateStore);
  let playlists = privateStore["_data"]["playlists"];
  const _commentid = req.body.data.id;
  const _playlistid = req.body.data.playlist_id;
  for (let i in playlists) {
    if (playlists[i]["id"] == _playlistid) {
      for (let j in playlists[i]["comments"]) {
        if (playlists[i]["comments"][j]["id"] == _commentid) {
          playlists[i]["comments"].splice(j, 1);
          privateStore.set("playlists", playlists);
          break;
        }
      }
    }
  }
  res.sendStatus(200);
});

router.post("/store_playlist", parsePost, function(req, res) {
  const result = req.handlePost(privateStore);

  const _user = req.body.data.user;
  const _token = req.body.data.token;

  const pre_playlist = privateStore.get("playlists");
  fetch("https://api.spotify.com/v1/me/playlists", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + _token,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(playlist => {
      let formatted_playlist = playlist["items"];
      for (let i in formatted_playlist) {
        formatted_playlist[i]["app_username"] = _user;
        formatted_playlist[i]["likes"] = new Array();
        formatted_playlist[i]["comments"] = new Array();
      }
      let final_array = pre_playlist.concat(formatted_playlist);
      privateStore.set(`playlists`, final_array);
    });
  if (typeof result !== "undefined") {
    res.send({ result });
  }
});

router.delete("/", parseDelete, function(req, res) {
  const result = req.handleDelete(privateStore);
  if (typeof result !== "undefined") {
    res.send({ result });
  }
});
