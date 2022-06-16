
var db = require('../database/connection')
var collection = require('../database/collection')
var bcrypt = require('bcrypt')
const async = require('hbs/lib/async')

const objectId = require('mongodb').ObjectId

module.exports ={

    vendorSignup:(vendorData)=>{
        return new Promise(async(resolve,reject)=>{
            vendorData.vpassword = await bcrypt.hash(vendorData.vpassword,10)
            // vendorData.vcfpassword = await bcrypt.hash(vendorData.vcfpassword,10)
            console.log(vendorData);
            vendorData.isActive = true
            db.get().collection(collection.VENDOR_COLLECTION).insertOne(vendorData).then((data)=>{
                resolve(data)

            })
        })
    },

    vendorLogin:(vendorData)=>{
        return new Promise(async(resolve,reject)=>{
            let vendorLoginStatus = false;
            let response = {}
            let owner = await db.get().collection(collection.VENDOR_COLLECTION).findOne({vemail:vendorData.vEmail})
            if(owner){
                bcrypt.compare(vendorData.vPassword,owner.vpassword).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.owner = owner
                        response.status = true
                        response.user= owner.vname
                        response.id = owner._id
                        resolve(response)
                    }else{
                        console.log("logedin failed");
                        resolve({status:failed})
                    }

                })
            }else{
                console.log("logedin failed");
                resolve({status:failed})
            }
        })
    },

    addRooms: (roomData,hotelId)=>{
        return new Promise(async(resolve,reject)=>{
            roomData.isAvailable = true
            category = roomData.category
            db.get().collection(collection.VENDOR_COLLECTION).updateOne({_id:objectId(hotelId)},{
                $push:{
                    'rooms' : roomData
                }
                
            },{ upsert:true}).then((data)=>{
                resolve(hotelId)
            })
        })
    },

    updateRoom:(editRoom,hotelId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENDOR_COLLECTION).updateOne({_id:objectId(hotelId)},{
                $set:{
                    'rooms':[editRoom ]  
                }
            },{upsert:true}).then((data)=>{
                resolve(data)
                console.log(hotelId);
            })
        })
},

getbooking:(hotelId)=>{
    console.log('hotel',hotelId);
    return new Promise(async(resolve,reject)=>{
        let bookingStatus = await db.get().collection(collection.USER_COLLECTION).aggregate([{
            $unwind:'$bookingDetails'
        },
        {$match:{'bookingDetails.hotelId':objectId(hotelId)}},
        {
            $project:{password:0,cfpassword:0}
        }
    ]).toArray()
    console.log('resolve',bookingStatus);
    resolve(bookingStatus)

    })
},

vendorRevenu:(hotelId)=> new Promise(async(resolve,reject)=>{
    let revenu = await db.get().collection(collection.USER_COLLECTION).aggregate([{
        $unwind:"$bookingDetails"
    },{$match:{"bookingDetails.hotelId":objectId(hotelId)}},
      {$match:{"bookingDetails.bookingStatus":"Payment Pending"}},
      {$group:{_id:null,total_revenu:{$sum:"$bookingDetails.billAmt"},count:{$sum:1}}}

]).toArray()
  console.log('revenu',revenu);
  resolve(revenu[0])
}),

getDailySales: (hotelId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const sales = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .aggregate([
            {
              $unwind: '$bookingDetails',
            },
            {
              $match: {
                $and: [
                  { 'bookingDetails.hotelId':objectId(hotelId) },
                  { 'bookingDetails.bookingStatus': 'Payment Pending' },
                ],
              },
            },
            {
              $group: {
                _id: '$bookingDetails.bookingDate',
                total: { $sum: '$bookingDetails.billAmt' },
              },
            },
          ])
          .toArray();

        function compare(a, b) {
          if (a._id.split('-')[2] < b._id.split('-')[2]) {
            return -1;
          }
          if (a._id.split('-')[2] > b._id.split('-')[2]) {
            return 1;
          }
          return 0;
        }

        sales.sort(compare);
        const date = [];
        const sales1 = [];
        const datas = {
          date,
          sales1,
        };
        for (const x in sales) {
          (datas.date[x] = sales[x]._id.split('-')[2]),
            (datas.sales1[x] = sales[x].total);
        }

        resolve(datas);
      });
    } catch (error) {
      reject(error);
    }
  }






}