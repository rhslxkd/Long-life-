package com.oraclejava.real.base;

import com.oraclejava.real.domain.entity.RealEstate;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class PageableResourceImpl implements PageableResource {

    int page = 1;

    int totalPages;

    List<? extends IEntity> content;

    String message;

    public PageableResourceImpl() {}
    public PageableResourceImpl(List<? extends IEntity> content,
                                int page, int totalPages) {
        this.content = content;
        this.page = page;
        this.totalPages = totalPages;
    }

}
