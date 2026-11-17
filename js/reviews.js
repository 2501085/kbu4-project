let allReviews = [];
let currentList = [];
let currentPage = 1;
const PAGE_SIZE = 10;

const tbody = document.querySelector("#reviewBody");
const noResult = document.querySelector("#noResult");
const pagination = document.querySelector("#pagination");

// reviews.json을 불러와서 화면에 표시 (불러오는 동안은 로딩 문구를 먼저 보여줌)
noResult.textContent = "후기를 불러오는 중...";
noResult.style.display = "block";
fetch("../data/reviews.json")
    .then(response => {
        if (!response.ok) throw new Error("JSON 불러오기 실패");
        return response.json();
    })
    .then(data => {
        // 작성일(date) 기준 최신순 정렬 — "YYYY.MM.DD" 형식은 문자열 비교로도 날짜순 정렬이 된다
        allReviews = data.sort((a, b) => b.date.localeCompare(a.date));
        currentList = allReviews;
        renderPage(1);
    })
    .catch(error => {
        console.error(error);
        noResult.textContent = "데이터를 불러오지 못했습니다.";
        noResult.style.display = "block";
    });

// 현재 목록(currentList) 기준으로 페이지 단위(10개씩)로 잘라서 테이블에 그려주는 함수
function renderPage(page) {
    currentPage = page;

    tbody.innerHTML = "";
    noResult.textContent = "검색 결과가 없습니다.";

    if (currentList.length === 0) {
        noResult.style.display = "block";
        renderPagination();
        return;
    }
    noResult.style.display = "none";

    const start = (page - 1) * PAGE_SIZE;
    const pageItems = currentList.slice(start, start + PAGE_SIZE);

    pageItems.forEach(review => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${review.title}</td>
            <td class="author">${review.author}</td>
            <td class="date">${review.date}</td>
        `;
        tbody.appendChild(tr);
    });

    renderPagination();
}

// currentList 길이에 맞춰 하단 페이지 번호 버튼(1,2,3...)을 그려주는 함수
function renderPagination() {
    pagination.innerHTML = "";

    const totalPages = Math.ceil(currentList.length / PAGE_SIZE);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = i;
        btn.className = "page-btn" + (i === currentPage ? " active" : "");
        btn.addEventListener("click", () => renderPage(i));
        pagination.appendChild(btn);
    }
}

// 검색창에 입력할 때마다 제목/작성자 기준으로 필터링 후 1페이지부터 다시 표시
document.querySelector("#reviewSearch").addEventListener("input", function () {
    const keyword = this.value.trim().toLowerCase();

    currentList = allReviews.filter(review =>
        review.title.toLowerCase().includes(keyword) ||
        review.author.toLowerCase().includes(keyword)
    );

    renderPage(1);
});