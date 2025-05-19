package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendConfirmationEmail(String to, String mobileNumber, String planName, Double amount, String transactionId, String paymentType) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Recharge Confirmation - MobiComm");

        String mailContent = String.format(
            "Dear Customer,\n\n" +
            "Thank you for recharging with MobiComm!\n\n" +
            "Recharge Details:\n" +
            "------------------------\n" +
            "Mobile Number  : %s\n" +
            "Plan Name      : %s\n" +
            "Amount Paid    : ₹%.2f\n" +
            "Payment Method : %s\n" +
            "Transaction ID : %s\n\n" +
            "Your recharge has been successfully processed.\n\n" +
            "For any support, feel free to reach out to our customer care.\n\n" +
            "Warm regards,\n" +
            "MobiComm Support Team",
            mobileNumber, planName, amount, paymentType, transactionId
        );

        message.setText(mailContent);
        mailSender.send(message);
    }
}
