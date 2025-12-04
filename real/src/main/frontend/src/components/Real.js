import {useState, useEffect, useCallback} from "react";
import Pagination from "./Pagination";

const TRADE_TYPES = [
    { value: "sale", label: "매매" },
    { value: "jeonse", label: "전세" },
    { value: "wolse", label: "월세" },
]

function Real() {
    const base = process.env.REACT_APP_API_BASE;
    const [loading, setLoading] = useState(true);
    //매물 목록 저장용 변수
    const [real, setReal] = useState([]);
    const [selectedTradeTypes, setSelectedTradeTypes] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);  //선택한 페이지

    // 체크 박스 변경
    const handleTradeTypesChange = (e) => {
        const { value, checked } = e.target;
        //alert("변경 : " + value + ", 여부: " + checked);
        setSelectedTradeTypes((prev) => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter((t) => t !== value);
            }
        })

    }

    // 데이터 가져오는 함수(useCallback)
    const fetchReal = useCallback(
        async (pageNumber, tradeTypes) => {
            setLoading(true);
            const params = new URLSearchParams();

            //?tradeTypes=Sale&tradeTypes=Jeonse ...
            tradeTypes.forEach((t) => {
                params.append("tradeTypes", t);
            });
            
            // 쿼리스트링은 기본적으로 String
            params.append("size", "3");
            params.append("page", String(pageNumber - 1));
            
            const queryString = params.toString();
            const url = `${base}/real?${queryString}`;  // queryString이 없으면 전체검색
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`서버 오류: ${res.status}`);
            }
            const result = await res.json();
            setReal(result.content);
            setTotalPages(result.totalPages);
            setLoading(false);
        }, [base]  // <-- 외부에처 참조하는 변수목록을 지정
    )
    
    // 검색 버튼 클릭 시 호출
    const handleSearch =  () => {
        setSelectedPage(1); //==> 나버지는 useEffect가 호출해줌

    }

    useEffect(() => {
        fetchReal(selectedPage, selectedTradeTypes);

    }, [fetchReal, selectedPage, selectedTradeTypes]);
        // useCallback함수, 함수의 매개변수, 기타 외부 참조 변수

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h2>물건 목록입니다.</h2>

            {/* 필터 영역 */}
            <div style={{ marginBottom: 10 }}>
                {TRADE_TYPES.map((t) => (
                    <label key={t.value} style={{ marginRight: 10 }}>
                        <input type="checkbox"
                                value={t.value}
                                onChange={handleTradeTypesChange}/>
                            {t.label}

                    </label>
                ))}

                <button
                    onClick={handleSearch}
                    style={{ marginLeft: 10 }}>검색</button>
            </div>

            {loading ? (
                <span>로딩중....</span>
            ) : (
                <div>
                    <table border="1" style={{margin: "0 auto"}}>
                        <thead>
                        <tr>
                            <th>id</th>
                            <th>제목</th>
                            <th>거래유형</th>
                            <th>매매가(보증금)</th>
                            <th>월세</th>
                            <th>주소</th>
                            <th>평수</th>
                            <th>작성일시</th>
                        </tr>
                        </thead>
                        <tbody>
                        {real.map(r => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.title}</td>
                                <td>{r.tradeType}</td>
                                <td>{r.price}</td>
                                <td>{r.monthlyRent}</td>
                                <td>{r.address}</td>
                                <td>{r.area}</td>
                                <td>{r.createdAt}</td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                    <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                        <Pagination
                            totalPages={totalPages}
                            paginate={setSelectedPage}
                            page={selectedPage}/>

                    </div>
                </div>
                    )}
                </div>
            );
            }

            export default Real;