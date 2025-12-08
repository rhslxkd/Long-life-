export default function Pagination({ totalPages, currentPage, paginate }) {
    const pageNumbers = [];

    // 1, 2, 3...
    for (let i=1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link"
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                disabled={currentPage === 1}>
                            이전</button>
                    </li>
                    {pageNumbers.map((number) => (
                    <li key={number}
                        className={`page-item ${number === currentPage ? "active" : ""}`}>
                        <button className="page-link"
                                onClick={() => paginate(number)}>{number}</button>
                    </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link"
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}>
                            다음</button>
                    </li>
                </ul>
            </nav>
        </div>

    )
}