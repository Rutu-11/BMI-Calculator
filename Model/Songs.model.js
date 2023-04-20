const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  id: { type: Number },
  readable: { type: Boolean },
  title: { type: String },
  title_short: { type: String },
  title_version: { type: String },
  link: { type: String },
  duration: { type: Number },
  rank: { type: Number },
  explicit_lyrics: { type: Boolean },
  explicit_content_lyrics: { type: Number },
  explicit_content_cover: { type: Number },
  preview: { type: String },
  md5_image: { type: String },
  artist: {
    id: { type: Number },
    name: { type: String },
    link: { type: String },
    picture: { type: String },
    picture_small: { type: String },
    picture_medium: { type: String },
    picture_big: { type: String },
    picture_xl: { type: String },
    tracklist: { type: String },
    type: { type: String }
  },
  album: {
    id: { type: Number },
    title: { type: String },
    cover: { type: String },
    cover_small: { type: String },
    cover_medium: { type: String },
    cover_big: { type: String },
    cover_xl: { type: String },
    md5_image: { type: String },
    tracklist: { type: String },
    type: { type: String }
  },
  type: { type: String }
});

const songModel = mongoose.model('Song', songSchema);

module.exports = {songModel};
