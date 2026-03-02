import {Router} from 'express'

import { send_verifylink,verify_verifylink } from '../controller/email.mjs';

const router =Router();

router.post("/send/verifylink",send_verifylink);
router.get("/verify/verifylink",verify_verifylink);

export {router};