import { Router } from "express";
import { Controller } from "../controllers/controllers.js";
import { Model } from "../models/mysql/model.js"; 
import multer from "multer"

export const createRouter = () => {

  const storagePosts = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/img/posts"); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const uploadPost = multer({ storage: storagePosts });

  const storageProfiles = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/img/profiles"); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const uploadProfile = multer({ storage: storageProfiles });



  const router = Router();
  const controller = new Controller ({Model: Model})

  router.get('/users',   controller.getMuchUsers);
  router.post('/upload',  uploadPost.single("image"), controller.insertPost);
  router.get('/user/profile/:userId',   controller.getUserProfile);
  router.post('/user/follow',   controller.followUser);
  router.delete('/user/unfollow',   controller.unfollowUser);
  router.get('/posts',   controller.getPosts);
  router.get('/messages/:receiverId',   controller.getMessages);
  router.get('/userMessages/:receiverId',   controller.getUserMessages);
  router.put('/viewMessages/',   controller.viewMessages);
  router.get('/chatsQuatityNotView/',   controller.chatNotViews);
  router.post('/login',  uploadProfile.single("profilePhoto"), controller.logIn);
  router.post('/signup', uploadProfile.single("profilePhoto"), controller.signUp);
  router.put('/editProfile', uploadProfile.single("profilePhoto"),  controller.editProfile);
  router.post('/logout',   controller.logOut);
  router.get('/user',   controller.getUserInfo);
  router.post('/comment/insert',   controller.insertComment);

  return router; 
};