import express from "express";
import { getlikes, addlike, deletelike } from "../controllers/like.js";

const router = express.Router()

router.get("/", getlikes) 
router.post("/", addlike) 
router.delete("/", deletelike) 


export default router