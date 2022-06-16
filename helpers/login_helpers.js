
var db = require('../database/connection')
var collection = require('../database/collection')
var bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

const Razorpay = require('razorpay');
// const { deletVendors } = require('./admin-helpers');
// require('dotenv').config();
var instance = new Razorpay({
    key_id: 'rzp_test_UL2JgpeRyabsBF',
    // key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: 'CNQT9ZR2XdSqYHgcQ5ue7U67',
    // key_secret: process.env.RAZORPAY_SECRET
});





module.exports = {

    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            userData.cfpassword = null
            await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email }).then((state) => {
                if (state) {
                    state.emailExists = true
                    resolve(state)
                } else {

                    console.log(userData);
                    userData.isActive = true;
                    db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((state) => {
                        resolve(state)
                    })

                }
            })

        })
    },



    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login failed");
                        resolve({ status: false })

                    }
                })
            } else {
                console.log("login failed");
                resolve({ status: false })
            }
        })
    },

    getRoomDetails: (hotelId) => {
        return new Promise(async (resolve, reject) => {
            let room = await db.get().collection(collection.VENDOR_COLLECTION).findOne({ _id: ObjectId(hotelId) })

            resolve(room)
        })
    },

    searchRoom: (searchData) => {
        try {
            return new Promise(async (resolve, reject) => {
                console.log(searchData.location);
                let getRoom = await db.get().collection(collection.VENDOR_COLLECTION).aggregate([{ $unwind: "$rooms" },
                {
                    $match: {
                        $and: [{ 'rooms.isAvailable': true }, { 'rooms.district': searchData.location }]
                    }
                }
                ]).toArray()
                console.log(getRoom);
                resolve(getRoom)
            })
        } catch(error){
          reject(error)
        }       
    },

    doBooking: (bookingData, userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {
                $push: {
                    'bookingDetails': { ...bookingData }
                }
            }, { upsert: true }).then((data) => {
                resolve(data)
            })
        })

    },

    updateQty: (bookingData) => new Promise((resolve, reject) => {
        db.get().collection(collection.USER_COLLECTION).updateOne(
            { _id: ObjectId(bookingData.hotelId) }, {
            $inc: {
                'rooms.$.qty': -1
            },
        },
        ).then((status) => {
            if (status) {
                db.get().collection(collection.VENDOR_COLLECTION).updateOne(
                    { 'rooms.qty': { $lt: 1 } },
                    {
                        $set: { 'rooms.$.isAvailable': false },
                    },

                );
            }
            resolve(status)
        })

    }),

    generateRazorPay: (orderId, totalPrice) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: totalPrice,  // amount in the smallest currency unit
                currency: "INR",
                receipt: `${orderId}`
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    resolve(order)
                    console.log(order);

                }

            });
        })


    },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'CNQT9ZR2XdSqYHgcQ5ue7U67');
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            } else {

                reject()
            }
        })

    },

    changePaymentStatus: (bookingId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ "bookingDetails.bookingId": ObjectId(bookingId) }, {
                $set: {
                    "bookingDetails.$.bookingStatus": "Paid"
                },
            }, { upsert: true }).then((response) => {
                resolve(response)
                console.log('change', response);

            })
        })

    },
    getUserBooking: (userId) => {
        try {
            return new Promise(async (resolve, reject) => {
                let userBooking = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectId(userId) })
                console.log('userbooking', userBooking);
                resolve(userBooking)
            })

        } catch (error) {
          reject(error)
        }
    },
    updateProfile: (data, userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) },
                {
                    $set: {
                        name: data.name,
                        number: data.number,
                        email: data.email
                    },
                }).then((status) => {
                    resolve(status);
                });
        })
    },

    cancelBooking: (bookingId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({
                "bookingDetails.bookingId": ObjectId(bookingId)
            },
                { $set: { "bookingDetails.$.bookingStatus": "cancel" } }
            ).then((response) => {
                resolve(response)
            })
        })
    },


















}
