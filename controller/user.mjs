import { checkStatus,storeUser,check,storeData as store,fetchUserdata,deleteLockit_usersdata,sorted_userdata,updatePws,fecthEmail} from "../model/user.mjs";
import { emailFormatChnagePws,sendMail } from "./emailHelper.mjs";
import { deleteToken } from "../model/email.mjs";

import jwt from 'jsonwebtoken' ;       //for generating token
import crypto from 'crypto';               //for generate pws;

async function signup_store(req,res){
    console.log("controller/user.mjs/signup_store");
    const json={};

    try{
        const form = req.body.form;
        // let result = await checkStatus(form)

        let result = await storeUser(form);
        if(result=="username already exist"){
            json.status=0;
            json.msg="username already exist!";
        }
        else if(result=="email already exist"){
            json.status=0;
            json.msg="email already exist!";
        }
        else{
            const token = jwt.sign({"username":form.username},"hello user");
            console.log("token generated :",token);
            json.msg="signup successfully!";
            json.status=1;
            json.token=token;
        }


    }
    catch(err){
        console.log("controller/user/signup_store :",err);
        json.msg="Server error!";
        json.status=0;
    }

    res.json(json);
}


async function signin_authenticate(req,res){
    console.log("users/signin_authenticate.mjs");
    const json = {};
    try{
        const data = {
            "username":req.headers["username"],
            "pws":req.headers["pws"]
        };

        console.log(data);
        
        const result = await check(data);

        if(result){
            console.log("signin succesfully");
            json.msg="signin succesfully";
            delete data.pws;
            const token = jwt.sign(data,"hello user");
            console.log("token generated!");
            json.status=1;
            json.token=token;
        }
        else{
            console.log("sginin failed");
            json.status=0;
            json.msg="username or password incorrect";
        }
    }
    catch(err){
        console.log("err (controller/user.mjs/signin_authenticate):",err);
        json["msg"]="Server Error";
        json.status=0;
    }

    console.log("users/sigin return",json);
    res.json(json);
}


async function isvalidateToken(req,res){
    res.json({"authorize":true,"status":1,"msg":"Authorized"});
}

async function randompws(req,res){
    const json={};
    console.log("controller/user.mjs/randompws()");
    try{
        let length =12;
        let chars ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}<>?';
    
        let pws = "";
    
        for(let c1=0;c1<length;c1++){
            let index=crypto.randomInt(0,chars.length);
            pws+=chars[index];
        }
    
        console.log("password generated :",pws);
        json.msg="password generated";
        json.status=1;
        json.pws=pws;
    }
    catch(err){
        console.log("Server error server/constroller/user.mjs",err);
        json.msg="Server Error!";
        json.status=0;
    }

    console.log(`controller/randompws:`,json)
    res.json(json)
}

async function storeData(req,res){
    console.log("/controller/users.mjs/storeData")
    const json={};
    json.authorize=true;
    try{
        const data=req.body.data;
        const result = await store(data);
        json.msg="data stored Successfully";
        json.status=1;
    }
    catch(err){
        console.log("err :server/contrller/user.mjs :",err);
        json.msg="Server Error";
        json.status=0;
    }
    console.log("res controller/user.mjs/storeData :",json);
    res.json(json);
}

async function getData(req,res){
    console.log("constroller/user/getData ");
    const json={"authorize":1};
    try{
        const username = req.query.username;
        const result = await fetchUserdata(username);
        json.status=1;
        result.rows=result.rows.map((obj)=>{
            obj.pws=Buffer.from(obj.pws,'base64').toString('utf8');
            return obj;
        })
        json.msg="data fetch successfully!";
        json.data=result.rows;
    }
    catch(err){
        console.log("err :controller/user/getData ",err);
        json.status=0;
        json.msg="Server Error";
    }

    console.log("response controller/user/getData :",json);
    res.json(json);
}

async function deleteData(req,res){
    console.log("deleteData :");
    const json = {"authorize":1};
    try{
        const username = req.query.username;
        const url = req.query.url;
    
        const result = await deleteLockit_usersdata(username,url);
        if(result){
            json.status=1;
            json.msg="Delete Successfully!";
        }
        else{
            json.status=0;
            json.msg="Data not match";
        }
    }
    catch(err){
        json.status=0;
        json.msg="Server Error!";
    }

    console.log("user.mjs/deleteData res :",json);
    res.json(json);

}

async function sortData(req,res){
    console.log("controller/users.mjs/sortData :");
    const json={"authorize":1};
    try{
        const username=req.query.username;
        const sortBy=req.query.sortBy;
        let result="";
        if(sortBy=="recently add")
            result = await fetchUserdata(username);
        else
            result = await sorted_userdata(username,sortBy);

        result.rows=result.rows.map((obj)=>{
            obj.pws=Buffer.from(obj.pws,'base64').toString('utf8');
            return obj;
        })

        json.status=1;
        json.msg=`Data sorted by ${sortBy}`;
        json.data=result.rows;
    }
    catch(err){
        console.log("controller/user.mjs/sortData :",err);
        json.status=0;
        json.msg-="server error!";
    }
    console.log("res sortData success");
    res.send(json);
}

async function changePws(req,res){
    console.log("chnagePws()");
    const json ={};
    try{
        let data = req.body.data;
        data={
            "username":data.username,
            "pws":data.oldPws,
            "newPws":data.newPws
        }

        let result = await check(data);
        if(!result){
            json.status=0,
            json.msg="Incorect Password!"
        }
        else{
            result = await updatePws(data.username,data.newPws);
            json.status=1;
            json.msg="Password Chnaged Successfully!";
            const recever= await fecthEmail(data.username);
            let body = await emailFormatChnagePws(data.username,data.pws,data.newPws);
            const subject = "Notification of Password Change";
            await sendMail(recever,subject,body);
            json.notify = "email sent successfully!";
        }
    }
    catch(err){
        json.status=0;
        json.msg="Server Error!";
        console.log("/changepws err:",err);
        res.send(err);
    }

    console.log("/controller/chnagePws response:",json);
    res.json(json);
}

export {signup_store,signin_authenticate,isvalidateToken,randompws,storeData,getData,deleteData,sortData,changePws};


//signup_store:-
//  got form data from client
//  check email is verified or not (by check status of given email) 
//  if email is verified then store data and delete token from table (now email verification link is expired );


//signin_authenticate:-
//  got data from cient
//  match data with database if matched res="success" else res="failer"
//      fetch pws from database then decode it and then match with user pws;

//AuthenticateToken:-
//  if token is valid then send a positive response;
//  else send false;


//randompws:-
//  genearte a random pws of 12 length;

//store data:-
//  get data from client and store them;
//  here we encode data by Buffer.from(data).toString('base64');
//  and prepare json;

//deleteData:-
//  get  username and url as query string;
//  delete data from lockit_userdata table;
//  if deleted so send a success json;
//  else send failyear message;

//sortData:-
//  getusername and sortBY column name from client;
//  if column name is recet add then call getDatafn 
//  else callsorted data fn which return a sorted data with respect to specified column name;
//  and according to response return a json;


//chnagePws():-
//  get data from client and pass old password in check function 
//  if old password is match with database store password that mean password is correct
//  then call update dara function which replace old password with new password;
//  after then get email body by passing username,old pws,new pws 
//  then send mail using sendmail function;

