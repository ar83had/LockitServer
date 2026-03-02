import {Router} from 'express';  
import {expressjwt} from 'express-jwt';       //for valid token;

import {signup_store,signin_authenticate,isvalidateToken,randompws,storeData,getData,deleteData,sortData,changePws} from '../controller/user.mjs';

const router = Router();

router.post("/signup/store",signup_store);
router.get("/signin/authenticate",signin_authenticate);
router.get("/",expressjwt({algorithms:['HS256'],secret:"hello user"}),isvalidateToken);
router.get("/randompws",randompws);
router.post("/store/data",expressjwt({algorithms:['HS256'],secret:"hello user"}),storeData);
router.get("/get/data",expressjwt({algorithms:['HS256'],secret:"hello user"}),getData);
router.delete("/delete/data",expressjwt({algorithms:['HS256'],secret:"hello user"}),deleteData);
router.get("/sort/data",expressjwt({algorithms:['HS256'],secret:"hello user"}),sortData);
router.post("/changepws",expressjwt({algorithms:['HS256'],secret:"hello user"}),changePws);

export {router};


//here we check wheather user is authorize or not 
//if not so error fn specifed in api/index.mjs is run;
//else coresponding function is run;