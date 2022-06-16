

// require('dotenv').config();
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const serviceId = process.env.TWILIO_SERVICE_ID
// const client = require('twilio')(accountSid, authToken);



//  module.exports = {

//     optGenerate:(phone_num)=> new Promise((resolve,reject)=>{
//         await client.verify.services(serviceId).verification.create({
//             to:`+91${phone_num}`,cheannel:'SMS'            
//         }).then((verification)=>{
//             resolve(verification)
//         }).catch(()=>{
//             reject();
//         });

//     }),

//     verfyOtp:(otp,phone_num)=> new Promise((resolve,reject)=>{
//         await client.verify.services(serviceId).verification.create({
//             to:`+91${phone_num}`,code: otp,
//         }).then((verification_check)=>{
//             resolve(verification_check)
//         }).catch(()=>{
//             reject();
//         })
//     })

//  }        


