
var express = require('express');
var router = express.Router();
const vendorHelpers = require('../helpers/vendor_helpers')
const verifyvendorlogin = (req,res,next)=>{
    if(req.session.vendorLoggedIn){
        next()
    }else{
        res.redirect('/vendor/vendorlogin')
    }

}




// rendreing vendorSingnup page 
router.get('/', (req, res) => {
    res.render('vendors/vendorSignup', { title: 'vendor',owner })
})

// vendor register
router.post('/vendorsignup', (req, res) => {
    vendorHelpers.vendorSignup(req.body).then((response) => {
        res.redirect('/vendor/vendorlogin')
        console.log(response);
    })

})

// rendering vendorLogin page
router.get('/vendorlogin',(req, res) => {
    res.render('vendors/vendorLogin', { isActive: req.session.isActive })
})

router.post('/vendorlogin', (req, res) => {
    console.log(req.body);
    vendorHelpers.vendorLogin(req.body).then((response) => {
        if (response) {
            req.session.isActive = true
            req.session.vendorLoggedIn = true
            req.session.owner = response.owner
            req.session.vendor = response
            res.redirect('/vendor/vendorhome')
            console.log(response);

        } else {
            req.session.loginErr = "Invalid username or password"
            res.redirect('/vendor/vendorlogin')
        }

    })
})

//rendering vendorHome page
router.get('/vendorhome', (req, res) => {
    res.render('vendors/vendorHome', { vendor: true })
})

router.post('/add',verifyvendorlogin,(req, res) => {
    console.log(req.body);
    const roomData = {
        'price': parseInt(req.body.vprice),
        'offer':parseInt(req.body.voffer),
        'netprice':(req.body.vprice*(100-req.body.voffer))/100,
        'category': req.body.vcategory,
        'qty': parseInt(req.body.vnrooms),
        'country': req.body.country,
        'state': req.body.state,
        'district': req.body.district,
        'ameneties': {}

    }
    if (req.body.ac === 'on') {
        roomData.ameneties.ac = true
    }
    if (req.body.wifi === 'on') {
        roomData.ameneties.wifi = true
    }
    if (req.body.powerbackup === 'on') {
        roomData.ameneties.powerbackup = true
    }
    if (req.body.parking === 'on') {
        roomData.ameneties.parking = true
    }

    vendorHelpers.addRooms(roomData, req.session.owner._id).then((id) => {
        let imageOne = req.files.imageone
        imageOne.mv('./public/room-img/' + id + '(1).jpg')
        let imageTwo = req.files.imagetwo
        imageTwo.mv('./public/room-img/' + id + '(2).jpg')
        let imageThree = req.files.imagethree
        imageThree.mv('./public/room-img/' + id + '(3).jpg')

        req.session.added = true
        res.redirect('/vendor/vendorhome')
        console.log(id);
    })
})

router.get('/editroom', (req, res) => {
    res.render('vendors/editRooms', { vendor: true })
})

router.post('/edit',verifyvendorlogin,(req, res) => {
    console.log(req.body);
    const editRoom = {
        'price': parseInt(req.body.vprice),
        'category': req.body.vcategory,
        'qty': parseInt(req.body.vnrooms),
        'country': req.body.country,
        'state': req.body.state,
        'district': req.body.district,
        'ameneties': {}

    }

    if (req.body.ac === 'on') {
        editRoom.ameneties.ac = true
    }
    if (req.body.wifi === 'on') {
        editRoom.ameneties.wifi = true
    }
    if (req.body.powerbackup === 'on') {
        editRoom.ameneties.powerbackup = true
    }
    if (req.body.parking === 'on') {
        editRoom.ameneties.parking = true
    }

    vendorHelpers.updateRoom(editRoom, req.session.owner._id).then((id) => {
        let imageOne = req.files.imageone
        imageOne.mv('./public/room-img/' + id + '(1).jpg')
        let imageTwo = req.files.imagetwo
        imageTwo.mv('./public/room-img/' + id + '(2).jpg')
        let imageThree = req.files.imagethree
        imageThree.mv('./public/room-img/' + id + '(3).jpg')

        req.session.edit = true;
        console.log(id);
        res.redirect('/vendor/editroom')

    })

})

router.get('/bookingstatus',verifyvendorlogin,(req, res) => {
    console.log('queryid',req.session.owner._id);
    vendorHelpers.getbooking(req.session.owner._id).then((bookingStatus) => {
        console.log('getbooking',bookingStatus);
        res.render('vendors/bookingStatus', { vendor:true,bookingStatus})
    })

})

router.get('/vendordashboard',verifyvendorlogin,(req,res)=>{
    vendorHelpers.vendorRevenu(req.session.owner._id).then((data)=>{
    vendorHelpers.getDailySales(req.session.owner._id).then((dataSales)=>{
        let rev = ((data.total_revenu*10)/100)
        let revProfit = (data.total_revenu-rev)
        req.session.revProfit = revProfit      
        res.render('vendors/vendorDashboard',{vendor:true,data,revProfit:req.session.revProfit,dataSales})

    })
    })
       
})





// vendorlogout
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/vendor/vendorlogin')
})




module.exports = router