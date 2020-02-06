import express from "express";
import {parseGet} from "../middlewares/parse_get";
import {parsePost} from "../middlewares/parse_post";
import {parseDelete} from "../middlewares/parse_delete";

export const router = express.Router();
export const prefix = '/public';

const {publicStore} = require('../data/DataStore');

router.post('/unlike', parsePost, function(req,res){
  const _id = req.body.data.id;
  const result = req.handlePost(publicStore);
  let likes = publicStore['_data']['playlists']['likes'];
  let pre_likes = likes[_id]-1;
  publicStore.set(`playlists.likes.${_id}`,pre_likes);
  const toReturn={};
  toReturn[_id] = pre_likes;
  res.send(toReturn);
})

router.post('/like', parsePost, function(req,res){
  const _id = req.body.data.id;
  const result = req.handlePost(publicStore);
  let likes = publicStore['_data']['playlists']['likes'];
  let pre_likes = likes[_id]+1;
  publicStore.set(`playlists.likes.${_id}`,pre_likes);
  const toReturn={};
  toReturn[_id] = pre_likes;
  res.send(toReturn);
})

router.get('/', parseGet, function (req, res) {
  console.log("Visited");
  const result = req.handleGet(publicStore);
  if (typeof result !== 'undefined') {
    res.send(publicStore['_data'])
  }
});

router.post('/*', parsePost, function (req, res) {
  const result = req.handlePost(publicStore);
  if (typeof result !== 'undefined') {
    res.send({result})
  }
});

router.delete('/*', parseDelete, function (req, res) {
  const result = req.handleDelete(publicStore);
  if (typeof result !== 'undefined') {
    res.send({result})
  }
});
