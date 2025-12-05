package com.oraclejava.real.controller;

import com.oraclejava.real.base.PageableResource;
import com.oraclejava.real.base.PageableResourceImpl;
import com.oraclejava.real.domain.entity.RealEstate;
import com.oraclejava.real.domain.entity.TradeType;
import com.oraclejava.real.domain.service.RealEstateService;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path="")
@RequiredArgsConstructor
public class RealRestController {

    private final RealEstateService realEstateService;


    //    @GetMapping("/real")
//    public List<RealEstate> getEstate(){
//        return tradeTypeService.getEstate();
//    }

    @GetMapping("/real")
    public PageableResource getEstate(
            @PageableDefault(size = 5)
            @RequestParam(name = "tradeTypes", required = false)
            List<TradeType> tradeTypes,
            Pageable pageable
    ) {

        if (tradeTypes == null || tradeTypes.isEmpty()) {
            //Page<RealEstate> realEstate = realEstateService.getEstates(pageable);
            val realEstate = realEstateService.getEstates(pageable); //위의 구문과 의미가 똑같다.
            //PageableResource resources =
            val resources =
                    new PageableResourceImpl(
                            realEstate.getContent(),
                            1,
                            realEstate.getTotalPages()
                    );
            resources.setMessage("부동산 월세정보");
            return resources;

        } else {
            val real = realEstateService.findByTradeTypes(tradeTypes, pageable);
            val resources =
                    new PageableResourceImpl(
                            real.getContent(),
                            1,
                            real.getTotalPages()
                    );
            resources.setMessage("부동산 전체정보");
            return resources;
        }

    }
}
