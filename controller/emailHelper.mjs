import jwt from 'jsonwebtoken';   //for encode and decode token
import nodemailer from 'nodemailer';    //for send email


const emailFromat = (email)=>{
    const token = jwt.sign({"email":email},"verification_link");    //encode token;

return[`      
 <div>
    <h2>Hi,</h2>
    <p>Thank you for registering with Lock-It ! To complete your sign-up, please verify your email address by clicking the link below:</p>
    <a href=https://lockit-api.vercel.app/email/verify/verifylink?token=${token} style="text-decoration: none;">varify email</a>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Thank you</p>
    <p>The Lock-It Team</p>
</div>
`,token]}

//this function is responsiable for send email to user;
async function sendMail(receiver,subject,body){    
    
    const transpoter = nodemailer.createTransport({   //connect nodemailer to our gamil account;
        service:"gmail",
        auth:{
            user:"arshadshmim786@gmail.com",
            pass:"csmc zgbc kuby igrj"      //this password for third party application that i generate
        }
    });

    const mailOptions = {                       //configure mail
        from:"arshadshmim786@gmail.com",
        to:receiver,
        subject:subject,
        html:body
    };

    transpoter.sendMail(mailOptions,(err,info)=>{    //send mail 
        if(err){
            console.log("error while sending email :",err);
        }
        else
        {
            console.log("email send successfully :",info.response);
        }
    });
}


async function emailFormatChnagePws(username,oldPws,newPws){
    return(
        ` 
        <div >
            <h3>Dear ${username},</h3>
            <p>We want to inform you that your Lockit account password has been successfully updated. Below are the details for your reference:</p>
            <ul>
                <li>Old Password :${oldPws}</li>
                <li>New Password :${newPws}</li>
            </ul>
            <p>Please ensure that you keep this information confidential to maintain the security of your account.</p>
            <p>Thank you for your attention to this matter.</p>

            <p>
                Best regards,<br>
                Lockit Team
            </p>
        </div>
        `
    )
}
export {emailFromat,sendMail,emailFormatChnagePws}
