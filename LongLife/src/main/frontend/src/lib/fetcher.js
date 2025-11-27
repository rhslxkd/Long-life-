// src/lib/fetcher.js
// 비동기 함수
export async function fetcher(input, init) {
    const res = await fetch(input, { credentials: "include", ...init});
    // if (res.status === 403) {
    //     window.location.href = "/forbidden";
    //     return;
    // }
    if (!res.ok) {
        const message = await res.text();
        const error = new Error(message || `HTTP ${res.status}`);
        error.status = res.status;
        throw error;
    }
    return res.json().catch(() => null);
}