export default function FormatKST(iso) {
    try {
        return new Date(iso).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    } catch {
        return iso;
    }
}