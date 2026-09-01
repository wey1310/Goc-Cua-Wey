export const DAILY_GARDEN_QUOTES = [
    {
        quote: "Có những Lá Trà chỉ cần ghé qua một lần là đã muốn quay lại.",
        author: "Góc của Wey"
    },
    {
        quote: "Mỗi tách trà là một câu chuyện, mỗi chiếc lá là một người bạn tri âm.",
        author: "Góc của Wey"
    },
    {
        quote: "Gió thổi nhẹ qua vườn, mang theo hương trà và những lời tâm sự bình yên.",
        author: "Góc của Wey"
    },
    {
        quote: "Hãy thong thả dạo bước, khu vườn luôn sẵn sàng chào đón bạn dừng chân.",
        author: "Góc của Wey"
    },
    {
        quote: "Thưởng một chén trà thơm, lắng nghe giai điệu dịu dàng của ngày mới.",
        author: "Góc của Wey"
    },
    {
        quote: "Trà ngon phải có bạn hiền, vườn đẹp phải có khách thưởng trà ghé thăm.",
        author: "Góc của Wey"
    },
    {
        quote: "Bình yên không ở đâu xa, bình yên nằm trong từng ngụm trà nhỏ mỗi sớm mai.",
        author: "Góc của Wey"
    }
];

export function getDailyQuote() {
    const now = new Date();
    // Deterministic index for the day of year
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return DAILY_GARDEN_QUOTES[dayOfYear % DAILY_GARDEN_QUOTES.length];
}
