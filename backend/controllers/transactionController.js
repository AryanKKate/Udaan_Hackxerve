const Transaction=require('../models/transaction')

exports.addTxn = async (req, res) => {
    console.log('yayay')
    try {
        const { amount, from, signature, to, requiredSignatures } = req.body;
        console.log(requiredSignatures)
        console.log(from)
        const reqsig=+requiredSignatures
        const txn = new Transaction({ amount, from, to,  requiredSignatures:reqsig })
        await txn.save();
        res.status(201).send("Transaction created successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
};

exports.getAllTxn = async (req, res) => {
    console.log(req.body);
    const { multisigWallet } = req.body;
    try {
        const txns = await Transaction.find({ from: multisigWallet })
        res.status(200).json({data: txns})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}

exports.signTxn = async (req, res) => {
    const { transactionId, signature } = req.body;
    try {
      const txn = await Transaction.findOne({ _id: transactionId });
  
      if (!txn) {
        return res.status(404).json({ success: false, error: "Transaction not found" });
      }
  
      let alreadySigned = false;
  
      txn.signatures.forEach((sign) => {
        if (sign.address === signature.address) {
          alreadySigned = true;
        }
      });
  
      if (alreadySigned) {
        return res.status(200).json({ success: false, error: "Already Signed" });
      }
  
      txn.signatures = [...txn.signatures, signature];
      await txn.save();
  
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  };
  

exports.executeTransaction = async (req, res) => {
    const { txHash, transactionId } = req.body;
    if(!txHash || !transactionId){
        res.status(400).json({error: "Invalid Hash of ID"})
    }
    try {
        const txn =await Transaction.findOne({ _id: transactionId });
        txn.txHash = txHash;
        txn.executed = true;
        txn.status="Complete"
        await txn.save();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}

