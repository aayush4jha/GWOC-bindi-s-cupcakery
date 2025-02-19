import React from "react";
import QRCode from "qrcode.react";

const UpiQrCode = ({ amount }) => {
    const upiId = "pravinkumarjha15@okicici";
    const payeeName = "Pravin Kumar Jha"; // Optional
    const transactionNote = "Order Payment"; // Optional
    const currency = "INR";

    // Construct the UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&mc=&tid=&tr=&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=${currency}`;

    return (
        <div>
            <h3>Scan to Pay</h3>
            <QRCode value={upiUrl} size={200} />
        </div>
    );
};

export default UpiQrCode;
