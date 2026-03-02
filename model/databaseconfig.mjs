
import pkg from 'pg'
const {Pool} = pkg;


export default function dbConnect(){
    const pool = new Pool({
        host:"aws-0-ap-south-1.pooler.supabase.com",
        port:"6543",
        user:"postgres.oxcxsvondqzyuucpivsj",
        password:"arShad@78611819814",
        database:"postgres",
        ssl:{rejectUnauthorized:false,},
    });

    return pool;
}

//database we use
//lockit_emailverify
//lockit_users
//lockit_usersdata
