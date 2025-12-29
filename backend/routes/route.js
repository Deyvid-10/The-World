import { Router } from "express";
import { Controller } from "../controllers/controllers.js";
import { Model } from "../models/mysql/model.js";  

export const createRouter = () => {
  const router = Router();

  const controller = new Controller ({Model: Model})

  router.get('/users',   controller.getMuchUsers);
  router.get('/posts',   controller.getPosts);
  router.post('/login',   controller.logIn);
  router.post('/signup',   controller.signUp);
  router.put('/editProfile',   controller.editProfile);
  router.post('/logout',   controller.logOut);
  router.get('/user',   controller.getUserInfo);
  router.post('/comment/insert',   controller.insertComment);

  return router; 
};