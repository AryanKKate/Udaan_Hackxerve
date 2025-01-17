const express = require('express');
const { addTxn, executeTransaction, getAllTxn, signTxn } = require("../controllers/transactionController.js");

const router = express.Router();

router.post("/", getAllTxn);
router.post("/add-transaction", addTxn);
router.post("/sign-transaction", signTxn);
router.post("/execute-transaction", executeTransaction);

module.exports=router