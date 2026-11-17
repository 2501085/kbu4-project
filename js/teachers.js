let instructors = [];

const positionSelect = document.querySelector("#positionSelect");
const championSearch = document.querySelector("#championSearch");
const grid = document.querySelector("#instructorGrid");
const noResult = document.querySelector("#noResult");
const resultCount = document.querySelector("#resultCount");
const resetBtn = document.querySelector("#resetBtn");
const modalOverlay = document.querySelector("#modalOverlay");
const modalClose = document.querySelector("#modalClose");
const modalImg = document.querySelector("#modalImg");
const modalTitle = document.querySelector("#modalTitle");
const modalCareer = document.querySelector("#modalCareer");
const modalChampions = document.querySelector("#modalChampions");
const modalBio = document.querySelector("#modalBio");

// instructors.json을 불러와서 화면에 표시 (불러오는 동안은 로딩 문구를 먼저 보여줌)
resultCount.textContent = "강사 정보를 불러오는 중...";
fetch("../data/instructors.json")
    .then(response => {
        if (!response.ok) throw new Error("JSON 불러오기 실패");
        return response.json();
    })
    .then(data => {
        instructors = data;
        renderInstructors(instructors);
    })
    .catch(error => {
        console.error(error);
        resultCount.textContent = "";
        grid.innerHTML = "";
        noResult.textContent = "데이터를 불러오지 못했습니다.";
        noResult.style.display = "block";
    });

// 강사 배열을 받아서 카드 그리드에 그려주는 함수
function renderInstructors(list) {
    grid.innerHTML = "";
    resultCount.textContent = list.length + "명 결과";
    noResult.textContent = "검색 결과가 없습니다.";

    if (list.length === 0) {
        noResult.style.display = "block";
        return;
    }
    noResult.style.display = "none";

    list.forEach(ins => {
        const card = document.createElement("div");
        card.className = "instructor-card";
        card.dataset.id = ins.id;
        card.innerHTML = `
            <img src="../images/${ins.img}" alt="${ins.name}" class="instructor-card-img">
            <p class="instructor-card-name">${ins.name} <span class="instructor-card-position">· ${ins.position}</span></p>
        `;
        card.addEventListener("click", () => showDetail(ins.id));
        grid.appendChild(card);
    });
}

// 포지션 필터 + 챔피언 검색 조건을 함께 적용
function applyFilter() {
    const position = positionSelect.value;
    const keyword = championSearch.value.trim().toLowerCase();

    const filtered = instructors.filter(ins => {
        const positionOk = position === "전체" || ins.position === position;
        // 챔피언 이름 중 하나라도 키워드를 포함하면 검색됨 (예: "겐" → 겐지, "라인" → 라인하르트)
        const championOk = keyword === "" ||
            ins.champions.some(ch => ch.toLowerCase().includes(keyword));
        return positionOk && championOk;
    });

    renderInstructors(filtered);
}

// 카드를 클릭하면 id로 해당 강사 1명을 찾아 화면 정중앙 모달로 상세 정보 표시
function showDetail(id) {
    const ins = instructors.find(i => i.id === id);
    if (!ins) return;

    modalImg.src = `../images/${ins.img}`;
    modalImg.alt = ins.name;
    modalTitle.innerHTML = `${ins.name} <span class="instructor-card-position">· ${ins.position}</span>`;
    modalCareer.textContent = ins.career;
    modalChampions.textContent = `주력 챔피언: ${ins.champions.join(", ")}`;
    modalBio.textContent = ins.bio;

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";   // 모달이 열려 있는 동안 뒤 화면 스크롤 방지
}

// 모달 닫기
function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);

// 모달 바깥(어두운 배경)을 클릭하면 닫기
modalOverlay.addEventListener("click", event => {
    if (event.target === modalOverlay) closeModal();
});

// Esc 키로 닫기
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modalOverlay.classList.contains("active")) closeModal();
});

// 초기화: 입력/선택값을 기본값으로 되돌리고 원본 전체를 다시 그림
resetBtn.addEventListener("click", () => {
    positionSelect.value = "전체";
    championSearch.value = "";
    renderInstructors(instructors);
});

positionSelect.addEventListener("change", applyFilter);
championSearch.addEventListener("input", applyFilter);