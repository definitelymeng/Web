import express from "express";
import { parseGet } from "../middlewares/parse_get";
import { parsePost } from "../middlewares/parse_post";
import { parseDelete } from "../middlewares/parse_delete";
import { authenticateUser } from "../middlewares/auth";
import { modifyUserPath } from "../middlewares/modify_user_path";
const fetch = require("node-fetch");

export const router = express.Router();
export const prefix = '/user';

const { userStore } = require('../data/DataStore');
const { privateStore } = require("../data/DataStore");

/**
 * Every request needs to be from a logged in user.
 * Modify path prefixes each request with the user's name.
 */
router.use([authenticateUser, modifyUserPath]);

router.get('/test', parseGet, function(req, res){
  const result = req.handleGet(userStore);
  if (typeof result !== 'undefined') {
    res.send({result})
  }
})

router.post('/save_token', parsePost, function (req, res) {
  const _user = req.body.data.user;
  const result = req.handlePost(userStore);

  if (typeof result !== 'undefined') {
    res.sendStatus(200);
  }
});

router.post('/*', parsePost, function (req, res) {
  const result = req.handlePost(userStore);
  if (typeof result !== 'undefined') {
    res.send({ result })
  }
});

router.delete('/*', parseDelete, function (req, res) {
  const result = req.handleDelete(userStore);
  if (typeof result !== 'undefined') {
    res.send({ result })
  }
});
