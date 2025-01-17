const cron = require('node-cron');
const moment = require('moment');
const Loan = require('./models/loan');  

cron.schedule('* * * * *', async () => {
    const now = moment().toDate();

    try {
        const loans = await Loan.find({
            "bids.bidCloseAt": { $lt: now },
            "bids.status": { $ne: "closed" }  
        });

        loans.forEach(loan => {
            loan.bids.forEach(bid => {
                if (moment(bid.bidCloseAt).isBefore(now)) {
                    bid.status = "closed";  
                }
            });
            loan.save();
        });

        console.log('Expired bids closed successfully');
    } catch (err) {
        console.error('Error closing expired bids:', err);
    }
});
