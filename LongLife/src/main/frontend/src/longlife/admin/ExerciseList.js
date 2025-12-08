import {use, useCallback, useEffect, useState} from "react";
import {fetcher} from "../../lib/fetcher";
import ExerciseForm from "./ExerciseForm";

export default function ExerciseList() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [cat1, setCat1] = useState([]);
    const [initCat2, setInitCat2] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedType1, setSelectedType1] = useState("");
    const [selectedType2, setSelectedType2] = useState("");
    const [selectedExercise, setSelectedExercise] = useState(null);

    // 처음 한번만 목록 로딩
    useEffect(() => {
        (async () => {
            try {
                const data = await fetcher('http://localhost:8080/api/exercise/init');
                setExercises(data.exercises);
                // 카테고리1 고정을 위해 처음에 랜더링 시 한번만
                // setCat1([...new Set(data.exercises.map((e) => e.type1))]);
                setCat1(data.type1List);
                setCat2(data.type2List);
                setInitCat2(data.type2List);
            } catch (e) {
                setErr(e.message);
            }
        })();
    }, []);

    const loadExercises = useCallback(async () => {
        setLoading(true);
        setErr(null);

        const params = new URLSearchParams();
        if (selectedType1) params.append("type1", selectedType1);
        if (selectedType2) params.append("type2", selectedType2);

        try {
            const data = await fetcher(`http://localhost:8080/api/exercise?${params}`);
            if (!data) return;
            setExercises(data);
            // 카테고리2 변경 및 고정을 위한 조건문
            if (selectedType1) {
                setCat2([...new Set(data.map((e) => e.type2))]);
            } else {
                setCat2(initCat2);
            }
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }, [selectedType1, selectedType2]);

    useEffect(() => {
        (async () => {
            await loadExercises();
        })();
    }, [loadExercises]);

    if (err) return <div className="text-danger">{err}</div>
    if (!loadExercises) return <div>로딩중...</div>

    // 운동종목 등록
    const handleAddClick = () => {
        // alert('추가 버튼 클릭함');
        setOpenForm(true);
        setSelectedExercise(null);
    }

    // 저장 콜백 버튼
    const handleSaved = () => {
        setOpenForm(false);
        (async () => {
            await loadExercises();
        })();
    }

    // 운동종목 수정
    const handleEditClick = (e) => {
        // alert(`수정 버튼 클릭함. id=${e.exerciseId}`);
        setSelectedExercise(e);
        setOpenForm(true); // 팝업창 띄우기
    }

    // 운동종목 삭제
    const handleDeleteClick = (e) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                (async () => {
                    const result = await fetcher(`http://localhost:8080/api/exercise/${e.exerciseId}`, {
                        method: "DELETE"
                    });
                    await loadExercises();
                })();
            } catch (e) {
                setErr(e.message);
            }
        }
    }

    return (
        <div className="container">
            <h1 className="mt-4 mb-4">운동 종목 목록</h1>
            {/* 검색 필터 */}
            <div className="row mb-3">
                <div className="col-md-3">
                    <label className="form-label">카테고리1</label>
                    <select className="form-select" value={selectedType1}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedType1(value);
                                if (!value) {
                                    // type1이 전체로 바뀌면 type2도 초기화
                                    setSelectedType2("");
                                }
                            }}>
                        <option value="">전체</option>
                        {cat1.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">카테고리2</label>
                    <select className="form-select" value={selectedType2} onChange={(e) => setSelectedType2(e.target.value)}>
                        <option value="">전체</option>
                        {cat2.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="text-end fs-5 mt-4 mb-2">
                <button className="btn btn-primary" onClick={handleAddClick}>운동종목등록</button>
            </div>
            <table className="table table-bordered">
                <thead className="table-dark">
                <tr>
                    <th>운동종목ID</th>
                    <th>카테고리1</th>
                    <th>카테고리2</th>
                    <th>운동명</th>
                    <th>설명</th>
                    <th>비고</th>
                </tr>
                </thead>
                <tbody>
                {exercises.map(e => (
                    <tr key={e.exerciseId}>
                        <td>{e.exerciseId}</td>
                        <td>{e.type1}</td>
                        <td>{e.type2}</td>
                        <td>{e.name}</td>
                        <td>{e.description}</td>
                        <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEditClick(e)}>수정
                            </button>
                            <button className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteClick(e)}>삭제
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/*팝업*/}
            {openForm && (
                <ExerciseForm
                    onClose={() => setOpenForm(false)}
                    onSaved={handleSaved}
                    initialExercises={exercises}
                    initialData={selectedExercise}
                />
            )}
        </div>
    );
}