import styled from "styled-components";

const PageUl = styled.ul`
    float: left;
    list-style: none;
    text-align: center;
    border-radius: 3px;
    color: white;
    padding: 1px;
    border-top: 3px solid #186ead;
    border-bottom: 3px solid #186ead;
    background-color: rgba(0, 0, 0, 0.4);
`;

const PageLi = styled.li`
    display: inline-block;
    font-size: 17px;
    font-weight: 600;
    padding: 5px;
    border-radius: 5px;
    width: 25px;
    &:hover {
        cursor: pointer;
        color: green;
        background-color: orange;
    }
`;

const PageSpan = styled.span`
    border-radius: 50%;
    color: white;
    padding: 0 12px 5px 9px;
    text-align: center;
    background-color: #263a6c;
`;

const Pagination = ({ page, totalPages, paginate }) => {
    const pageNumbers = [];
    // 1, 2, 3 ....
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    return (
        <div>
            <nav>
                <PageUl className="pagination">
                    {pageNumbers.map((number) => {
                        if (page === number) {
                            return (
                                <PageLi key={number} className="page-item">
                                    <PageSpan style={{color: "red"}}>
                                        {number}
                                    </PageSpan>
                                </PageLi>
                            );
                        } else {
                            return (
                                <PageLi key={number} className="page-item">
                                    <PageSpan onClick={() => paginate(number)}
                                              className="page-link">
                                        {number}
                                    </PageSpan>
                                </PageLi>
                            );
                        }
                    })}
                </PageUl>
            </nav>
        </div>
    );
};

export default Pagination;

















