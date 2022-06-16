
var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers')
var vendorHelpers = require('../helpers/vendor_helpers')
const verifyadminlog = (req,res,next)=>{
    if(req.session.adminlogged){
       next()
    }else{
        res.redirect('/admin')
    }
}


router.get('/',(req,res)=>{
    res.render('adminPanel/adminLogin',{title: 'adminlogin'});
})

router.get('/adminhome',verifyadminlog,(req,res)=>{
    adminHelpers.vendorData().then((data)=>{
        console.log(data);
        res.render('adminPanel/adminHome',{admin:true,data});
    }).catch((error)=>{
       console.log(error);
       res.redirect('/')
    })
    
})

router.post('/adminlogin',(req,res)=>{
    console.log(req.body);
    adminHelpers.adminLogin(req.body).then((response)=>{  
         if(response){
            req.session.adminlogged = true
            res.redirect('/admin/adminhome')
         }else{
           req.session.adminlogerr = true
           res.redirect('/')
           console.log(response);           
         }
    })
})

router.get('/delete-vendor/',(req,res)=>{
    let vendorId = req.query.id
    console.log(vendorId);
    adminHelpers.deletVendors(vendorId).then((response)=>{
        res.redirect('/admin/adminhome')
        console.log(response);

    })
})


router.get('/adminroom',verifyadminlog,(req,res)=>{
    let id = req.query.id
    // console.log(true);
    console.log(id);
    adminHelpers.getRooms(req.query.id).then((rooms)=>{
    console.log(rooms);
    res.render('adminPanel/adminVendorDetail',{admin:true,rooms})
    }).catch((error)=>{
       console.log(error);
       res.redirect('/')
    })
    
})

router.get('/adminuserdetail',verifyadminlog,(req,res)=>{
    adminHelpers.userData().then((users)=>{
        res.render('adminPanel/adminUserDetails',{admin:true,users})
    }).catch((error)=>{
       console.log(error);
       res.redirect('/')
    })
})

// router.get('/delete-user',(req,res)=>{
//     let userID = req.query.id
//     console.log(userID);
//     adminHelpers.deletUser(userID).then((response)=>{
//         res.redirect('/admin/adminuserdetail')
//     })
// })

router.get('/block-user',(req,res)=>{
    let userID = req.query.id
    console.log(userID);
    adminHelpers.blockUser(userID).then((response)=>{
        res.redirect('/admin/adminuserdetail')
    })
})
router.get('/unblock-user',(req,res)=>{
    let userID = req.query.id
    console.log(userID);
    adminHelpers.unBlockUser(userID).then((response)=>{
        console.log(response);
        res.redirect('/admin/adminhome')
    })
})

// router.get('/block-vendor',(req,res)=>{
//     console.log(req.query.id,"sdfghj");
//     let vendorID = req.query.id
//     console.log(vendorID);
//     adminHelpers.blockVendor(vendorID).then((response)=>{
//         console.log(response);
//         res.redirect('/admin/adminhome')
//     })
// })

// router.get('/unblock-vendor',(req,res)=>{
//     let vendorID =  req.query.id
//     console.log(vendorID);
//     adminHelpers.unBlockVendor(vendorID).then((response)=>{
//         console.log(response);
//         res.redirect('/admin/adminhome')
//     })
// })

router.get('/bookingdetail',(req,res)=>{
    adminHelpers.userData().then((users)=>{
        console.log(users);
        res.render('adminPanel/bookingDetails',{admin:true,users})
    }).catch((error)=>{
       console.log(error);
       res.redirect('/')
    })
    
})
router.get('/adminsalesreport',(req,res)=>{
    res.render('adminPanel/adminSalesReport',{admin:true})
})


// adminlogout
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/admin')
  })

  router.get('/admindashboard',verifyadminlog,(req,res)=>{
    adminHelpers.totalSales().then((data)=>{
    adminHelpers.getWeeklySales().then((salesDatas)=>{
    adminHelpers.cancelBookings().then((cancel)=>{
        console.log('cnc',cancel);
        console.log('sales',data);
        console.log('weekly',salesDatas);
        let share = ((data.total_sales*10)/100)
        let profit = (data.total_sales-share)
        req.session.pro = profit
        console.log('share',share);
        console.log('profit',profit);
        res.render('adminPanel/adminDashboard',{admin:true,data,pro:req.session.pro,salesDatas,cancel})
    }).catch((error)=>{
        console.log(error);
        res.redirect('/')
    })
    }).catch((error)=>{
        console.log(error);
        res.redirect('/')
    })       
    }).catch((error)=>{
        console.log(error);
        res.redirect('/')
    })

  })




module.exports = router;