import express from 'express'
import { getPublicProfileBySlug } from '../controller/shareController.js';

const shareRoutes = express.Router();

shareRoutes.get("/:slug", getPublicProfileBySlug);

export default shareRoutes;