var express = require('express');
// const res = require('express/lib/response');
var router = express.Router();
const loginHelpers = require('../helpers/login_helpers')
const adminHelpers = require('../helpers/admin-helpers');
// const req = require('express/lib/request');
const objectId = require('mongodb').ObjectId
require('dotenv').config();
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid,authToken);
var moment = require('moment')
const varifylogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/userlogin')
  }
}



/* GET home page. */
router.get('/', function (req, res,) {
  let user = req.session.user
  console.log(user);
  res.render('index', { title: 'home', user });
});


// rendering userLoginpage
router.get('/userlogin', (req, res) => {
  loggedIn = req.session.loggedIn
  if (loggedIn) {
    res.redirect('/')
  } else {
    res.render('userLogin', { login: req.session.loginErr })
    req.session.loginErr = false
  }

})

//userlogin
router.post('/login', (req, res) => {
  loginHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      if (response.user.isActive) {
        req.session.loggedIn = true
        req.session.user = response.user
        res.redirect('/')
      } else {
        req.session.loginErr = "Invalid username or password"
        res.redirect('/userlogin')

      }
    } else {
      req.session.loginErr = "Invalid username or password"
      res.redirect('/userlogin')

    }
  })

})

// user logout
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

// userSignup page rendering
router.get('/usersignup', (req, res) => {
  res.render('userSignup', { title: 'signup' })
})

// user register signup

router.post('/signup', (req, res) => {
  loginHelpers.doSignup(req.body).then((response) => {
    res.redirect('/')
    console.log(response);
  })
})

// router.post('/otpCheck', (req, res) => {
//   console.log('otp');
//   req.session.userDetails = req.body;
//   console.log(req.body);
//   const code = '+91';
//   const number = code.concat(req.body.number);
//   req.session.verifyNumber = number;
//   console.log(number);
//   client.verify
//     .services('VA8a06c96d70714d92d8989f4b64ee57a2')
//     .verifications.create({ to: number, channel: 'sms' })
//     .then(() => res.render('otpverify', { number: req.body.number }))
//     .catch((err) => {
//       if (err) {
//         res.send('Network Issue please try again later');
//       }
//     });
// });

// router.post('/verifyOtp', (req, res) => {
//   const otpObj = req.body;
//   const toNumber = req.session.verifyNumber;
//   const otpArr = Object.values(otpObj);
//   const otp = otpArr.join('');

//   client.verify
//     .services('VA8a06c96d70714d92d8989f4b64ee57a2')
//     .verificationChecks.create({ to: toNumber, code: otp })
//     .then((verification_check) => {
//       console.log(verification_check.status);
//       if (verification_check.status == 'approved') {
//         loginHelpers.doSignup(req.session.userDetails).then((data) => {
//           if (data.emailExists) {
//             req.session.emailExists = true;
//             res.redirect('/usersignup');
//           } else 
//             req.session.loggedIn = true;
//             req.session.user = data;
//             req.session.userName = req.session.userDetails.name;
//             res.redirect('/');
          
//         });
//       }else{
//         console.log('not approved')
//       }
//     });
// });



// rendering roomslist

router.get('/rooms',(req, res) => {

  adminHelpers.getRooms().then((rooms) => {
    if (req.session.getdetail) {   
      res.render('rooms', { title: 'rooms', rooms: req.session.getdetail, search: req.session.searchData ,user:req.session.user})
      // delete req.session.getdetail
    } else {      
      res.render('rooms', { title: 'rooms', rooms })
    }
  })

})


// rendering roomDetails

router.get('/roomdetails', (req, res) => {
  let hotelId = req.query.id
  loginHelpers.getRoomDetails(hotelId).then((room) => {
    console.log(room);
    res.render('roomDetails', { title: 'viewdetails', room,user:req.session.user })
  })
})


router.post('/search', (req, res) => {
  console.log(req.body);
  let firstdate = new Date(req.body.checkindate)
  let seconddate = new Date(req.body.checkoutdate)
  let timeDifference = Math.abs(seconddate.getTime() - firstdate.getTime())
  let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
  req.session.days = differentDays

  let searchDetails = {
    location: req.body.location,
    checkindate: req.body.checkindate,
    checkoutdate: req.body.checkoutdate,
    adults: req.body.adults,
    room: req.body.room,
    days: req.session.days
  }
  let searchData = searchDetails;
  loginHelpers.searchRoom(searchData).then((getRoom) => {
    req.session.getdetail = getRoom
    req.session.searchData = searchData
    res.redirect('/rooms')
  }).catch((error)=>{
    console.log(error);
    res.redirect('/')
  })

  router.get('/booking',varifylogin,(req, res) => {
    let hotelId = req.query.id

    loginHelpers.getRoomDetails(hotelId).then((room) => {
      req.session.room = room     
      let price = req.session.room.rooms[0].netprice
      let rooms = req.session.searchData.room
      let days = req.session.searchData.days
      let orgprice = req.session.room.rooms[0].price
      req.session.searchData.amt = (price * rooms * days)
      req.session.searchData.off = (orgprice-price)
      req.session.room = room
     

    })
    res.render('booking', { room: req.session.room, search: req.session.searchData,user:req.session.user })
  })
})

router.post('/confirmBook',(req,res)=>{
  req.session.searchData.paymentMode =  req.body.paymentMode
  console.log('pay',req.session.searchData.paymentMode);
  console.log(req.body);
  let bookingData = {
    bookingId: new objectId(),
    hotelId: objectId(req.session.room._id),
    hotelName:req.session.room.vname,
    category:req.session.room.rooms[0].category,
    price:req.session.room.rooms[0].price,
    checkIn:req.session.searchData.checkindate,
    checkOut:req.session.searchData.checkoutdate,
    guests:req.session.searchData.adults,
    roomCount:req.session.searchData.room,
    days:req.session.searchData.days,
    billAmt:req.session.searchData.amt,
    paymentMode:req.session.searchData.paymentMode,
    bookingDate: new Date().toISOString().split('T')[0],
    bookingStatus:'Payment Pending'
  };
  req.session.bookingData = bookingData;
  console.log(req.session.bookingData);
  loginHelpers.doBooking(bookingData,req.session.user._id).then((data)=>{
    if(data){
      loginHelpers.updateQty(bookingData,req.session.user._id).then((status)=>{
        if(req.body.paymentMode === 'hotel'){
          res.json()
        }else{
          loginHelpers.generateRazorPay(bookingData.bookingId,bookingData.billAmt*100).then((response)=>{
            console.log('res',response);
            res.json({response,check:true})
          })
 
        }
        

      })
    }
    console.log(data);

  })
  
  
})

router.post('/verify-payment',(req,res)=>{
  console.log(req.body);
  loginHelpers.verifyPayment(req.body).then(()=>{
    loginHelpers.changePaymentStatus(req.body['order[response][receipt]']).then(()=>{
      res.json({status:true})
    })
  }).catch((err)=>{
    console.log('err',err);
    res.json({status:false,errMsg:''})
  })
})

router.get('/userprofile',varifylogin,(req,res)=>{
  loginHelpers.getUserBooking(req.session.user._id).then((userBooking)=>{4
    res.render('userProfile',{user:req.session.user,userBooking})
  })
 
})


router.get('/userbookinghistory',(req,res)=>{
  loginHelpers.getUserBooking(req.session.user._id).then((userBooking)=>{
   console.log('leng',userBooking.bookingDetails.length);


     for(let x in userBooking.bookingDetails){
       var date = moment(userBooking.bookingDetails[x].checkOut)
       var now = moment()

       if(now > date){
         st = "checkOut"
         userBooking.bookingDetails[x].status = st
         console.log('status',userBooking.bookingDetails.status);
        
       }else{
         st = "Reserved"
         userBooking.bookingDetails[x].status = st
        
       }

     }
     console.log('user',userBooking);
    
   
    res.render('userBookingHistory',{user:req.session.user,userBooking})
  }).catch((error)=>{
    console.log(error);
    res.redirect('/')
  })
})

router.post('/updateprofile',(req,res)=>{
  let data = {
    name:req.body.name,
    email:req.body.email,
    number:req.body.number

  }
  console.log(data);
  loginHelpers.updateProfile(data,req.session.user._id).then((status)=>{
    console.log(status);
    res.json({data:true})
  })
})



router.get('/cancelbooking',(req,res)=>{
  console.log('bookingId',req.query.bookingId);
  loginHelpers.cancelBooking(req.query.bookingId).then((status)=>{
    console.log(status);
    res.json({status:true})
  })
}),

// router.get('/otp',(req,res)=>{
//   res.render('otpverify')
// })




module.exports = router;
