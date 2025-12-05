package com.oraclejava.real.base;

import java.util.List;

public interface PageableResource {
    int getPage();
    void setPage(int page);

    int getTotalPages();
    void setTotalPages(int totalPages);

    List<? extends IEntity> getContent();
    void setContent(List<? extends IEntity> content);

    String getMessage();
    void setMessage(String message);
}
