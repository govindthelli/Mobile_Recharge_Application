package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Recharge;
import com.example.demo.model.Subscriber;
import com.example.demo.repository.RechargeRepository;
import com.example.demo.repository.SubscriberRepository;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class SubscriberController {
    @Autowired
    private SubscriberRepository subscriberRepository;

    @Autowired
    private RechargeRepository rechargeRepository;
    
    @PostMapping("/subscriber/register")
    public ResponseEntity<?> addSubscriber(@RequestBody Subscriber subscriber)
    {
    	 	if (subscriber.getMobileNumber() == null || !subscriber.getMobileNumber().matches("^[0-9]{10}$")) {
    	        return ResponseEntity.badRequest().body("Invalid mobile number");
    	    }
    	    if (subscriber.getName() == null || subscriber.getName().trim().isEmpty()) {
    	        return ResponseEntity.badRequest().body("Name is required");
    	    }
    	    if (subscriber.getEmail() == null || !subscriber.getEmail().contains("@")) {
    	        return ResponseEntity.badRequest().body("Valid email is required");
    	    }
    	    
    	    subscriber.setCreatedAt(LocalDate.now());
    	    subscriberRepository.save(subscriber);
    	    return ResponseEntity.ok("Subscriber registered successfully");
    }

    @GetMapping("/subscribers/expiring")
    public ResponseEntity<List<Subscriber>> getExpiringSubscribers() {
        return ResponseEntity.ok(subscriberRepository.findExpiringSubscribers());
    }

    @GetMapping("/subscribers/{mobileNumber}/history")
    public ResponseEntity<List<Recharge>> getRechargeHistory(@PathVariable String mobileNumber) {
        if (!mobileNumber.matches("^[0-9]{10}$")) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(rechargeRepository.findByMobileNumber(mobileNumber));
    }
}