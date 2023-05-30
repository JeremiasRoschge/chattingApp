import { Router } from "express";
import { profile , index} from "../controllers/index.controller.js";
import { isLoggedIn, ensureVerified } from '../lib/auth.js';


const router = Router();

router.get('/', index)

router.get("/profile", isLoggedIn, ensureVerified, profile);




export default router;
