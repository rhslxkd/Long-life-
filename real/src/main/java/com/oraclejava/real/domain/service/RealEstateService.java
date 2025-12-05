package com.oraclejava.real.domain.service;

import com.oraclejava.real.domain.entity.RealEstate;
import com.oraclejava.real.domain.entity.TradeType;
import com.oraclejava.real.domain.repository.RealEstateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.xml.xpath.XPathFunctionException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RealEstateService extends BaseTransactionService{

    private final RealEstateRepository tradeTypeRepository;

//    public List<RealEstate> getEstate(){
//        return tradeTypeRepository.findAll();
//    }

  public Page<RealEstate> getEstates(Pageable pageable) {
   return tradeTypeRepository.findAll(pageable);
  }

  public Page<RealEstate> findByTradeTypes(List<TradeType> tradeType,Pageable pageable) {
      return tradeTypeRepository.findByTradeTypes(tradeType,pageable);
  }

}
