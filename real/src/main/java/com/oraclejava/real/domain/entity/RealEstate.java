package com.oraclejava.real.domain.entity;
import java.time.LocalDateTime;

import com.oraclejava.real.base.IEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "real_estate")
public class RealEstate implements IEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Column(name = "trade_type")
    private TradeType tradeType;
    private Long price;

    @Column(name = "monthly_rent")
    private Long monthlyRent;

    private String address;
    private Double area;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

}
