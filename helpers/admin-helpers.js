
var db = require('../database/connection')
var collection = require('../database/collection')
var bcrypt = require('bcrypt')
const async = require('hbs/lib/async')


const objectId = require('mongodb').ObjectId

module.exports = {

    adminLogin: (adminDetails) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ aEmail: adminDetails.email })
            console.log(adminDetails, admin);
            if (admin) {
                console.log(adminDetails.pswrd, admin.aPswrd);
                bcrypt.compare(adminDetails.pswrd, admin.aPswrd).then((status) => {
                    console.log(status);
                    if (status) {
                        console.log("admin login successfuly");
                        response.manage = adminDetails
                        response.status = true
                        resolve(response)

                    } else {
                        console.log("error login failed");
                    }
                })
            }

        })
    },

    vendorData: () => {
        try {
            return new Promise(async (resolve, reject) => {
            let vendor = await db.get().collection(collection.VENDOR_COLLECTION).find({}).toArray()
            resolve(vendor)
            })

        } catch(error){
          reject(error)
        }
       
    },

    deletVendors: (vendorId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENDOR_COLLECTION).deleteOne({ _id: objectId(vendorId) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },

    getRooms: (id) => {
        try {
            return new Promise(async (resolve, reject) => {
                let rooms = await db.get().collection(collection.VENDOR_COLLECTION).aggregate([
                    { $match: { "rooms.isAvailable": true } },
                    { $unwind: "$rooms" }
                ]).toArray()
                console.log(rooms);
                resolve(rooms)
            });
        } catch (error) {
            reject(error)
        }
    },

    userData: () => {
        try {
            return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find({}).toArray()
            resolve(users)
            });
        } catch (error) {
            reject(error)
        }
    },

    deletUser: (userID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userID) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },

    blockUser: (userID) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userID) }, { $set: { isActive: false } }).then((response) => {
                resolve(response)
            })

        })
    },

    unBlockUser: (userID) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userID) }, { $set: { isActive: true } }).then((response) => {
                resolve(response)
            })

        })
    },

    blockVendor: (vendorID) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.VENDOR_COLLECTION).updateOne({ _id: objectId(vendorID) }, { $set: { isActive: false } }).then((response) => {
                resolve(response)
            })

        })
    },

    unBlockVendor: (vendorID) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.VENDOR_COLLECTION).updateOne({ _id: objectId(vendorID) }, { $set: { isActive: true } }).then((response) => {
                resolve(response)
            })

        })
    },

    totalSales: () => new Promise(async (resolve, reject) => {
        try {
            let sales = await db.get().collection(collection.USER_COLLECTION).aggregate([{ "$unwind": "$bookingDetails" },
            { $match: { "bookingDetails.bookingStatus": "Payment Pending" } },
            { $group: { _id: null, total_sales: { $sum: "$bookingDetails.billAmt" }, count: { $sum: 1 } } }
            ]).toArray()
            console.log(sales);
            resolve(sales[0])
        } catch (error) {
            reject(error)
        }
    }),
    cancelBookings: () => new Promise(async (resolve, reject) => {
        try {
            let cancel = await db.get().collection(collection.USER_COLLECTION).aggregate([{ "$unwind": "$bookingDetails" },
            { $match: { "bookingDetails.bookingStatus": "cancel" } },
            { $group: { _id: null, count: { $sum: 1 } } }
            ]).toArray()
            console.log('cancel', cancel);
            resolve(cancel[0])
        } catch (error) {
            reject(error)
        }
    }),

    getWeeklySales: () => {
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
                                'bookingDetails.bookingStatus': 'Payment Pending'
                            }

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
