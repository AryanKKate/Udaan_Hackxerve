// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract MicroLoans {
    enum Status { pending, approved, rejected }
    enum Type { personal, business, student }

    struct Person {
        string name;
        uint256 age;
        string city;
        string addr;
        string adhar_num;
        string image;
        Status st;
        uint256 credit;
        uint256 strikes;
        uint256 income;
        uint256 savings;
        uint256 debt;
        string profession;
    }

    struct RequestedLoan {
        uint256 amount;
        Type typeOfLoan;
        string description;
        address requester;  // Add the address of the requester
    }

    struct ApprovedLoan {
        uint256 amount;
        Type typeOfLoan;
        string description;
        uint256 duration;
        uint256 interestRate;
        uint256 totalAmount;
        uint256 paidAmount;
        uint256 monthlyPayment;
        uint256 nextPaymentDue;
        address borrower;
        address lender;
        bool isActive;
    }

    modifier onlyVerified(address person) {
        require(kycData[person].st == Status.approved, "KYC Status is not approved");
        _;
    }

    mapping(address => Person) private kycData;
    mapping(address => RequestedLoan[]) private userRequestedLoans;
    mapping(address => ApprovedLoan[]) private userApprovedLoans;
    
    // Store all requested loans
    RequestedLoan[] private allRequestedLoans;
    
    // Store all approved loans
    ApprovedLoan[] private allApprovedLoans;

    function addKYC(
        address addre,
        string memory name,
        uint256 age,
        string memory city,
        string memory addr,
        string memory adhar_num,
        string memory image,
        uint256 _income,
        uint256 _savings,
        string memory _profession
    ) public {
        kycData[addre] = Person(name, age, city, addr, adhar_num, image, Status.pending, 0, 0, _income, _savings, 0, _profession);
    }

    function approveKYC(address person) public {
        Person storage temp = kycData[person];
        temp.st = Status.approved;
    }

    function rejectKYC(address person) public {
        Person storage temp = kycData[person];
        temp.st = Status.rejected;
    }

    function getKYC(address user) public view returns (Person memory) {
        return kycData[user];
    }

    function requestLoan(uint256 amount, Type _type, string memory description) public onlyVerified(msg.sender) {
        RequestedLoan memory _temp = RequestedLoan(amount, _type, description, msg.sender);
        userRequestedLoans[msg.sender].push(_temp);
        allRequestedLoans.push(_temp);  // Add to global list
    }

    function getAllRequestedLoans() public view returns (RequestedLoan[] memory) {
        return allRequestedLoans;
    }

    function getAllApprovedLoans() public view returns (ApprovedLoan[] memory) {
        return allApprovedLoans;
    }

    function getUserRequestedLoans(address _user) public view onlyVerified(msg.sender) returns (RequestedLoan[] memory) {
        return userRequestedLoans[_user];
    }

    function getUserApprovedLoans() public view onlyVerified(msg.sender) returns (ApprovedLoan[] memory) {
        return userApprovedLoans[msg.sender];
    }

    function approveLoan(
        address borrower,
        uint256 loanIndex,
        uint256 duration,
        uint256 interestRate
    ) public payable {
        RequestedLoan memory requestedLoan = userRequestedLoans[borrower][loanIndex];

        uint256 totalInterest = (requestedLoan.amount * interestRate * duration) / (100 * 12);
        uint256 totalAmount = requestedLoan.amount + totalInterest;
        uint256 monthlyPayment = totalAmount / duration;

        ApprovedLoan memory newLoan = ApprovedLoan({
            amount: requestedLoan.amount,
            typeOfLoan: requestedLoan.typeOfLoan,
            description: requestedLoan.description,
            duration: duration,
            interestRate: interestRate,
            totalAmount: totalAmount,
            paidAmount: 0,
            monthlyPayment: monthlyPayment,
            nextPaymentDue: block.timestamp + 30 days,
            borrower: borrower,
            lender: msg.sender,
            isActive: true
        });
        
        uint256 payment = msg.value;
        require(payment >= requestedLoan.amount, "Please dont send less than the requested amount");
        bool success = payable(msg.sender).send(payment);
        require(success, "Payment Failed");
        kycData[borrower].debt+=totalAmount;
        userApprovedLoans[msg.sender].push(newLoan);
        allApprovedLoans.push(newLoan);  // Add to global list

        delete userRequestedLoans[borrower][loanIndex];
    }

    function repayLoan(address borrower, uint256 loanIndex) public payable onlyVerified(borrower) {
        ApprovedLoan storage loan = userApprovedLoans[borrower][loanIndex];
        require(loan.isActive, "Loan is not active");

        uint256 startOfDueDay = (loan.nextPaymentDue / 1 days) * 1 days;
        require(block.timestamp >= startOfDueDay, "Payment not due yet");

        uint256 payment = msg.value;
        require(payment >= loan.monthlyPayment, "Insufficient payment amount");
        bool success = payable(loan.lender).send(payment);
        require(success, "Payment failed");

        kycData[msg.sender].credit += 2;
        kycData[msg.sender].debt-=payment;
        loan.paidAmount += payment;
        loan.nextPaymentDue += 30 days;

        if (loan.paidAmount >= loan.totalAmount) {
            loan.isActive = false; 
        }
    }

    function checkMissedPayments(address borrower) public {
        for (uint256 i = 0; i < userApprovedLoans[borrower].length; i++) {
            ApprovedLoan storage loan = userApprovedLoans[borrower][i];
            if (loan.isActive && block.timestamp > loan.nextPaymentDue) {
                kycData[borrower].strikes++;
                kycData[borrower].credit -= 5;
                loan.nextPaymentDue += 30 days; 
            }
        }
    }

    function getStrikes(address borrower) public view returns (uint256) {
        return kycData[borrower].strikes;
    }
}
