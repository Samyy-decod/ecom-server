const express = require('express')
const router = express.Router();
const { isAutherenticatedUser, Autherizeroles } = require('../middlewares/auth');
const { CreateOrder, getSingleOrder, myOrder, getAllOrders, updateOrder, DeleteOrder } = require('../controller/orderCrontrol');

router.post("/order/new",isAutherenticatedUser,CreateOrder)     //^ Create Order

router.get("/order/:id",isAutherenticatedUser,getSingleOrder)      //^get Single Order
router.get("/orders/my",isAutherenticatedUser,myOrder)      //^get myOrder
router.get("/admin/orders",isAutherenticatedUser,Autherizeroles("admin","subadmin"),getAllOrders)      //&get All Orders
router.put("/admin/update/orders/:id",isAutherenticatedUser,Autherizeroles("admin","subadmin"),updateOrder)      //&update Order
router.delete("/admin/order/:id",isAutherenticatedUser,Autherizeroles("admin","subadmin"),DeleteOrder)      //!Delete Order

module.exports =router;