import { Router } from "express";
import { profile, signupGet, signupPost, signIn, signInPost, logout, showVerificationPage, verifyCode } from "../controllers/auth.controller.js";
import { isLoggedIn, isNotLoggedIn, ensureVerified } from '../lib/auth.js';

const router = Router();

router.get('/signup', isNotLoggedIn, signupGet);
router.post('/signup', signupPost);
router.get("/verify", showVerificationPage);
router.post("/verify", verifyCode);
router.get('/signin', isNotLoggedIn, signIn);
router.post('/signin', signInPost);
router.get('/logout', isLoggedIn, logout);

export default router;