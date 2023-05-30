import { Router } from "express";
import {addLink, addRender, getAllLinks, deleteLink, editLink, updateLink} from "../controllers/links.controller.js";

import { checkTextForBadWords} from "../controllers/badwords.controller.js";

import { isLoggedIn } from '../lib/auth.js';

const router = Router();



router.get('/add', isLoggedIn, addRender)

router.post('/add', isLoggedIn, addLink)

router.get('/', isLoggedIn, getAllLinks)

router.get('/delete/:id', isLoggedIn, deleteLink);

router.get('/edit/:id', isLoggedIn, editLink);

router.post('/edit/:id', isLoggedIn, updateLink);
export default router;
