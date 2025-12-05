export async function fetcher(input, init) {
    const res = await fetch(input, { credentials: "include", ...init });
    console.log("HTTP status:", res.status);

    // 204 No Content 처리
    if (res.status === 204) return null;

    // 오류 처리
    if (!res.ok) {
        let message = "요청 중 오류가 발생하였습니다.";
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            message = json.message || text || message;
        } catch {
            if (text) message = text;
        }
        throw new Error(message);
    }

    // JSON 파싱
    try {
        return await res.json();
    } catch {
        return null; // JSON이 아닌 경우
    }
}