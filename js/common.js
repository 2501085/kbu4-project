// ============================================================
// common.js — 모든 페이지가 함께 쓰는 공통 스크립트
// 맨 위로 가기 버튼: 스크롤 위치(window.scrollY)에 따라 보이거나 숨기고,
// 클릭하면 scrollTo()로 부드럽게 맨 위로 이동합니다.
// ============================================================
const topBtn = document.querySelector("#topBtn");

// 300px 이상 내려오면 버튼을 보이고(show 클래스 추가), 아니면 숨김(show 클래스 제거)
window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
        topBtn.classList.add("show");
    } else {
        topBtn.classList.remove("show");
    }
});

// 버튼을 클릭하면 페이지 맨 위로 부드럽게 이동
topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});