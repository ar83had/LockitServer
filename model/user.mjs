import { connect } from "http2";
import dbConnect from "./databaseconfig.mjs";
import bcrypt from 'bcrypt';           //for encode or decode the password;

async function checkStatus(form){
    const table = "lockit_emailverify";
    const db = await dbConnect();
    console.log("checkStatus :database connected");
    const email = form.email;

    let query = `select status from ${table} where email='${email}'`
    let {rows} = await db.query(query);
    if(rows.length==0){
        console.log(`email not presenct in ${table} or not verified`);
        return false;
    }
    else{
        const status = rows[0].status;
        console.log("email is verified!");
        return status;
    }
}

async function storeUser(form){
    const db = await dbConnect();
    let table = "lockit_users";
    console.log("storeUser :database connected!");

    form.pws = await bcrypt.hash(form.pws,5);   //there 5 is as a parameter higher strong and lower weak;
    console.log("pws hashed successfully :",form.pws);
      
    let query = `create table if not exists ${table}(username varchar(100) primary key,email varchar(100) unique,pws varchar(100))`;
    let result = await db.query(query);

    try{
        query= `insert into ${table} values ('${form.username}','${form.email}','${form.pws}')`;
        result = await db.query(query);
        console.log("value inserted !",form);
        return "Signup Successfully";
    }
    catch(err){
        console.log("model/user.mjs/storeUser :",err);
        if(err.code=='23505'){
            if(err.detail==`Key (email)=(${form.email}) already exists.`){
                console.log("email already exist");
                return "email already exist";
            }
            else if(err.detail==`Key (username)=(${form.username}) already exists.`){
                console.log("username already exist")
                return "username already exist";
            }
        }
    }
}


async function check(data) {
    const db = dbConnect();
    let table = "lockit_users";
    let query = `select * from ${table} where username='${data.username}'`
    const result = await db.query(query);
    if(result.rowCount==0)
        return 0;
    else{
        const ret = await bcrypt.compare(data.pws,result.rows[0].pws)
        return ret;
    }
}

async function storeData(data){
    console.log("enter model/stoteData");
    const db = dbConnect();
    console.log("database connected !");

    const table = "lockit_usersdata";
    let query = `create table if not exists ${table} (username varchar(50),url varchar(100) primary key,user_indentifier varchar(75),pws varchar(100))`
    let result = await db.query(query);

    data.pws = Buffer.from(data.pws).toString('base64');
    query = `delete from ${table} where url='${data.url}'`;
    result = await db.query(query);
    if(result.rowCount==1)
        console.log("url already exists so delete previous url");

    query = `insert into ${table} values ('${data.username}','${data.url}','${data.user_indentifier}','${data.pws}')`
    result = await db.query(query);
    console.log("data stored",data);
}

async function fetchUserdata(username){
    try{
        const db=dbConnect();
        const table="lockit_usersdata";
    
        let query = `select * from ${table} where "username"='${username}'`;
        const result = await db.query(query)
        return result;
    }
    catch(err){
        console.log("err model/user/fetchUseradata :",err);
        throw err;
    }
}

async function deleteLockit_usersdata(username,url){
    try{
        const db=dbConnect();
        const table="lockit_usersdata";
        let query=`delete from ${table} where "username"='${username}' and "url"='${url}'`
        console.log(query);
        const result = await db.query(query);
        return result.rowCount;
    }
    catch(err){
        console.log("err model/user/deleteLockit_usersdata :",err);
        return 0;
    }
}

async function sorted_userdata(username,sortBy){
    try{
        const db=dbConnect();
        const table="lockit_usersdata";
        let query=`select * from ${table} where "username"='${username}' order by "${sortBy}"`;
        const result = await db.query(query);
        return result;
    }
    catch(err){
        console.log("model/sorted_usersdata err :",err);
    }
}


async function updatePws(username,pws){
    try{
        const db = dbConnect();
        let table = 'lockit_users';
        pws = await bcrypt.hash(pws,5);
        let query = `update ${table} set "pws"='${pws}' where "username"='${username}'`;
        const result = await db.query(query);
        return 1;
    }
    catch(err){
        console.log("/model/updatePws err :",err);
        return 0;
    }
}

async function fecthEmail(username){
    const db = dbConnect();
    let table = "lockit_users";
    let query = `select email from ${table} where "username"='${username}'`
    const result = await db.query(query);
    const email = result.rows[0].email;
    return email;
}

export {checkStatus,storeUser,check,storeData,fetchUserdata,deleteLockit_usersdata,sorted_userdata,updatePws,fecthEmail}