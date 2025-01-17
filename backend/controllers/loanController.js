const Loan = require("../models/loan");
const moment = require("moment");

function generateUniqueBits() {
  return Math.random() * 100;
}

function adjustPriceBasedOnDemandSupply(loan, buyDemand) {
  const demandEffect = buyDemand * 2;
  const adjustedPrice = loan + demandEffect;
  return adjustedPrice;
}

exports.getUserLoans = async (req, res) => {
  const { address } = req.params;
  const userLoans = await Loan.find({ address: address, status: "pending" });
  res.json(userLoans);
};

exports.bid_count = async (req, res) => {
  try {
    const { loanId } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const bidCount = loan.bidCount;
    res.json({
      message: "Bid count retrieved successfully.",
      bidCount: bidCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bid count", error: error });
  }
};

exports.setLoan = async (req, res) => {
  console.log("calling");
  try {
    console.log(req.body);
    const { address, userLoan, userPercentage, loanIndex } = req.body;

    const newLoan = new Loan({
      address: address,
      loan: userLoan,
      percentage: userPercentage,
      bidCount: 0,
      buyDemand: 0,
      paidAmount: 0,
      returnOnLoan: 0,
      totalLoanValue: userLoan,
      bids: [],
      loanIndex: loanIndex,
    });

    await newLoan.save();
    res.json({
      message: "Loan has been created successfully.",
      loan: newLoan,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating loan", error: err });
  }
};

exports.getLoan = async (req, res) => {
  const loans = await Loan.find({});
  res.json(loans);
};

exports.approveBid = async (req, res) => {
  const { loanId } = req.body;
  const loan = await Loan.findById(loanId);
  if (loan) {
    loan.acceptedBid = loan.bids[loan.bids.length - 1];
    loan.lender = loan.bids[loan.bids.length - 1].bidBy;
    loan.status = "approved";
    loan.paid = false;
  }
  await loan.save();
  res.json({ message: "Bid has been approved", loan: loan });
};

exports.getUserApprovedBids = async (req, res) => {
  const { address } = req.params;
  const loan = await Loan.find({ lender: address });
  res.json(loan);
};

exports.approveBid = async (req, res) => {
  const { loanId } = req.body;
  const loan = await Loan.findById(loanId);
  if (loan) {
    loan.acceptedBid = loan.bids[loan.bids.length - 1];
    loan.lender = loan.bids[loan.bids.length - 1].bidBy;
    loan.status = "approved";
    loan.paid = false;
  }
  await loan.save();
  res.json({ message: "Bid has been approved", loan: loan });
};


exports.getUserApprovedBids = async (req, res) => {
  const { address } = req.params;
  const loan = await Loan.find({ lender: address });
  res.json(loan);
};


exports.bid = async (req, res) => {
  try {
    const { loanId, bidBy } = req.body;
    const uniqueBits = generateUniqueBits();

    const bidOpenAt = moment().toDate();
    const bidCloseAt = moment().add(30, "minutes").toDate();
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const updatedLoan = adjustPriceBasedOnDemandSupply(
      loan.loan,
      loan.buyDemand + uniqueBits
    );

    const updatedPercentage = loan.percentage - uniqueBits / 100;
    const paidAmount = updatedPercentage - loan.percentage;
    const returnOnLoan = (updatedLoan * updatedPercentage) / 100;
    const totalLoanValue = updatedLoan + returnOnLoan;

    const newBid = {
      bidBy,
      uniqueBits,
      paidAmount,
      returnOnLoan,
      bidOpenAt,
      bidCloseAt,
      bidAt: moment().toDate(),
      status: "pending",
    };

    loan.bids.push(newBid);
    loan.buyDemand += uniqueBits;
    loan.bidCount++;
    loan.loan = updatedLoan;
    loan.percentage = updatedPercentage;
    loan.paidAmount = paidAmount;
    loan.returnOnLoan = returnOnLoan;
    loan.totalLoanValue = totalLoanValue;

    // Add updated percentage to percentageHistory
    loan.percentageHistory.push(updatedPercentage);

    const savedLoan = await loan.save();

    res.json({
      message: `Bid placed successfully with unique bits factor of ${uniqueBits.toFixed(
        2
      )}.`,
      paidAmount: paidAmount.toFixed(2),
      currentPercentage: updatedPercentage.toFixed(2),
      returnOnLoan: returnOnLoan.toFixed(2),
      demand: loan.buyDemand.toFixed(2),
      totalLoanValue: totalLoanValue.toFixed(2),
      bidCount: loan.bidCount,
      loan: savedLoan,
    });
  } catch (err) {
    res.status(500).json({ message: "Error placing bid", error: err });
  }
};

// New function to mark loan as done after money is sent
exports.markLoanAsDone = async (req, res) => {
  try {
    const { loanId } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Check if the loan status is currently "approved" and not already marked as done
    if (loan.status !== "approved") {
      return res
        .status(400)
        .json({ message: 'Loan must be in "approved" status to mark as done' });
    }

    // Mark loan as done and set paid to true
    loan.status = "done";
    loan.paid = true;

    await loan.save();

    res.json({
      message: "Loan status updated to Done.",
      loan: loan,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating loan status to Done", error: err });
  }
};

// Controller to get all percentage history
exports.all_percentage = async (req, res) => {
  try {
    const { loanId } = req.body;

    // Find loan by ID
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Return the percentageHistory array
    res.json({
      message: "Percentage history fetched successfully",
      percentageHistory: loan.percentageHistory,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching percentage history", error: err });
  }
};