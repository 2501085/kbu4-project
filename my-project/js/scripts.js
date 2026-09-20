/**
 * ============================================================
 * [KBU4 Game Academy - 메인 스크립트]
 * 1. 스크롤 위치 감지 -> 상단 헤더 그림자(Shadow) 인터랙션
 * 2. GNB 네비게이션 클릭 -> 해당 섹션 부드러운 스크롤(Smooth Scroll)
 * ============================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("KBU4 Game Academy 스크립트가 정상 로드되었습니다.");

  // 1. 스크롤 시 헤더 스타일 변경 (스크롤 내리면 그림자 추가)
  const header = document.querySelector(".header");
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 2. GNB '강사진' 메뉴 클릭 시 부드럽게 스크롤 이동
  const instructorMenu = document.querySelector('a[href="#instructors"]');
  const instructorSection = document.getElementById("instructors");

  if (instructorMenu && instructorSection) {
    instructorMenu.addEventListener("click", (e) => {
      e.preventDefault(); // 기본 앵커 튕김 현상 방지
      
      // 헤더 높이(72px)만큼 여백을 빼고 부드럽게 이동
      const headerOffset = 72;
      const elementPosition = instructorSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    });
  }
});