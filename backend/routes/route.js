import { Router } from "express";
import { Controller } from "../controllers/controllers.js";
import { Model } from "../models/mysql/model.js"; 
import multer from "multer"

export const createRouter = () => {

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/img/posts"); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

// Crear la instancia de multer con esa configuración
const upload = multer({ storage });


  const router = Router();
  const controller = new Controller ({Model: Model})

  router.get('/users',   controller.getMuchUsers);
  router.post('/upload',  upload.single("image"), controller.insertPost);
  router.get('/user/profile/:userId',   controller.getUserProfile);
  router.post('/user/follow',   controller.followUser);
  router.delete('/user/unfollow',   controller.unfollowUser);
  router.get('/posts',   controller.getPosts);
  router.post('/login',   controller.logIn);
  router.post('/signup',   controller.signUp);
  router.put('/editProfile',   controller.editProfile);
  router.post('/logout',   controller.logOut);
  router.get('/user',   controller.getUserInfo);
  router.post('/comment/insert',   controller.insertComment);

  return router; 
};