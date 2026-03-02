import exp from 'constants';
import express, { urlencoded } from 'express'
import { router as handleEmail }  from '../router/email.mjs';
import {router as handleuser} from '../router/user.mjs';
import cors from 'cors';    //for get data from client (only get object);
import ejs from 'ejs';         //for render ejs file
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);         //for render html page 
const __dirname = dirname(__filename);
app.set("view engin","ejs");
app.set("views",path.resolve(path.join(__dirname, '../views')))




app.use(express.json());
app.use(cors());

app.use("/authorization",handleuser);
app.use("/email",handleEmail);
app.use("/user",handleuser);
app.get("/randompws",handleuser);

app.use((err,req,res,next)=>{
    if(err.name=="UnauthorizedError"){
        console.log(err.name);
        res.json({"authorize":false,"status":0,"msg":"Not Authorized"});
    }
    
    console.log(err);
    res.end();
})

app.listen(2000,(err)=>{
    if(err) 
        console.log(err);
    else
        console.log("Srever Started on port number 2000 ");
});

//   "/authorize" for auhorize the page;
//   "/user" for handle user query
//    "/email" for handle email quey;
//     "/randompws" from generate random passsword;

