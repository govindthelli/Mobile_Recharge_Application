package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Getter
@Setter
@Entity
@Table(name = "plans")
public class Plan {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	@Enumerated(EnumType.STRING)
	private Category category;
	private Double price;
	private String data;
	private String calls;
	private String sms;
	private Integer validityDays;

	public enum Category {
	    Popular, Validity, Data, Unlimited, Special
	}

	}