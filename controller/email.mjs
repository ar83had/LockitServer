import { emailFromat,sendMail } from './emailHelper.mjs';  //for sending mail
import { storeToken,verifyEmail as updateStatus } from '../model/email.mjs';

import jwt from 'jsonwebtoken';  //for encode or decode email;
import express from 'express';

const app = express();

async function send_verifylink(req,res){
    console.log("email/send_verifylink()");
    const json={};
    try{
        const [emailBody,token]=emailFromat(req.body.email);
        const email = req.body.email;
        const subject = "Verify Your Email Address for Lock-It";
        const body=emailBody;
        const recevier = email;
        await sendMail(recevier,subject,body);
        await storeToken(email,token);
        json.msg="Email sent Successfully";
        json.status=1;
    }
    catch(err){
        console.log("cotroller/email/sendemail :",err);
        json.status=0;
        json.msg="Server Error";
    }

    console.log("email/sendEmail return",json);
    res.json(json);
}

function verify_verifylink(req,res){     //this route verify user;
    const token = req.query.token;
    
    jwt.verify(token,"verification_link",async (err,email)=>{
        if(err){
            console.log("Invalid Email :",err);
            res.end();
        }
        else{
            let msg = await updateStatus(email.email);
            if(msg=="You are already verified !" || msg=="Email verifited Successfully !")
                res.render("success.ejs",{"bgcolor":"bg-success","msg":msg});
            else
                res.render("failer.ejs",{"bgcolor":"bg-danger","msg":msg});
            console.log("message :",msg);
        };
    });

}

export{verify_verifylink,send_verifylink};



//send_verifylink:-
//  got email from client
//  and got email body and token form emailhelper.mjs file
//  then send mail


//verify_veifylink:-
//  decode token;
// update status of decoded email;
//  render success or failer page according to msg;