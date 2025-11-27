//src/lib/fetcher.js
//비동기 함수 fetcher를 내보낸다

export async function fetcher(input, init) {
    const res = await fetch(input, {credentials: "include", ...init});
    //if (res.status === 403) {
    //    window.location.href = "/forbidden";
    //    return;
    //}
    if (!res.ok) {
        const message = await res.text();
        const err = new Error(message || `HTTP ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return res.json().catch(() => null);

}