import express from 'express'
import { requireAuth } from "../middleware/auth.js";
import upload from "../config/Multer.js";
import { uploadProfileCV, uploadProfilePhoto } from '../controller/filesController.js';

const fileRoutes = express.Router();

// Photo upload route
fileRoutes.post("/:id/photo", requireAuth, upload.single("file"), uploadProfilePhoto);

// CV upload route
fileRoutes.post("/:id/cv", requireAuth, upload.single("file"), uploadProfileCV);

export default fileRoutes;