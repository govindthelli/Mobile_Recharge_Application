package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "subscribers")
public class Subscriber {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true,nullable = false)
	private String mobileNumber;
	private String name;
	
	@Column(unique = true,nullable = false)
	private String email;
	@ManyToOne
	private Plan currentPlan;
	private LocalDate planExpiry;
	private Double dataUsed;
	private String dataTotal;
	private LocalDate createdAt;

	
}