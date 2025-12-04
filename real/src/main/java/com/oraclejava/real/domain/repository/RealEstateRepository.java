package com.oraclejava.real.domain.repository;

import com.oraclejava.real.domain.entity.RealEstate;
import com.oraclejava.real.domain.entity.TradeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RealEstateRepository extends JpaRepository<RealEstate, Long> {

//        @Query("select s from RealEstate s order by s.monthlyRent asc")
//        List<RealEstate> findAll();

    @Query("""
            select 
            s from RealEstate s 
            order by s.monthlyRent asc
            """)
    Page<RealEstate> findAll(Pageable pageable);

    @Query("""
            select r 
            from RealEstate r
            where r.tradeType in :tradeTypes
            order by r.monthlyRent asc
            """)
    Page<RealEstate> findByTradeTypes(
            @Param("tradeTypes") List<TradeType> tradeTypes,Pageable pageable
    );
}
