import {useState, useEffect} from "react";
import {fetcher} from "../../lib/fetcher";

export default function ExerciseForm({ onClose, onSaved, initialExercises, initialData }) {
    const [exercises, setExercises] = useState([]);
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);

    const [err, setErr] = useState("");

    const isEdit = !!initialData; // !! => 데이터 존재여부(값이 있으면 true, 없으면 false)

    // 존재할 때 => 수정
    useEffect(() => {
        setExercises(initialExercises);

        // 수정일 때
        if (isEdit && initialData) {
            setType1(initialData.type1);
            setType2(initialData.type2);
            setName(initialData.name);
            setDescription(initialData.description);
        }
    }, [isEdit, initialExercises, initialData]);

    // 카테고리1 세팅
    useEffect(() => {
        setCat1([...new Set(exercises.map((e) => e.type1))]);
    }, [exercises]);

    // 카테고리1에 따른 카테고리2 세팅
    useEffect(() => {
        if (type1) {
            setCat2([...new Set(exercises.filter(e => e.type1 === type1).map(e => e.type2))])
        } else {
            setCat2([...new Set(exercises.map(e => e.type2))]);
        }
    }, [type1, exercises]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");

        if (!type1 || !type2 || !name) {
            setErr("카테고리와 운동명을 모두 입력해주세요")
            return;
        }

        const dto = {
            type1: type1,
            type2: type2,
            name: name,
            description: description
        }

        try {
            if (isEdit) {
                await fetcher(`http://localhost:8080/api/exercise/${initialData.exerciseId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dto)
                });
            } else {
                await fetcher('http://localhost:8080/api/exercise', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dto)
                });
            }
            // 추가가 성공하였다면 닫기
            onSaved();
        } catch (err) {
            setErr(err.message);
        }
    }

    return (
        <div style={backdropStyle}>
            <div style={modalStyle}>
                <h3>운동 종목 { isEdit ? '수정' : '추가' }</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">카테고리1</label>
                        <select className="form-select" value={type1}
                                onChange={(e) => setType1(e.target.value)}>
                            <option value="">유형 선택</option>
                            {cat1.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-2">
                        <label className="form-label">카테고리2</label>
                        <select className="form-select" value={type2}
                                onChange={(e) => setType2(e.target.value)}>
                            <option value="">분류 선택</option>
                            {cat2.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-2">
                        <label className="form-label">운동명</label>
                        <input className="form-control" type="text" value={name}
                               onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="mt-2">
                        <label className="form-label">설명</label>
                        <input className="form-control" type="text" value={description}
                               onChange={(e) => setDescription(e.target.value)}/>
                    </div>

                    {err && (
                        <div className="alert alert-danger py-1 mt-2">
                            {err}
                        </div>
                    )}

                    <div className="mt-3 d-flex justify-content-end">
                        <button className="btn btn-primary me-2" type="submit">{isEdit ? '수정' : '추가'}</button>
                        <button className="btn btn-secondary" type="button" onClick={onClose}>닫기</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// 간단 백드랍 스타일
const backdropStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
}

const modalStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "4px",
    minWidth: "360px"
}