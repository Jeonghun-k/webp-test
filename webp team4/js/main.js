// js/main.js

// ================== 검색 폼 & 내 위치 검색 ==================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const citySelect = document.getElementById("city");
  const districtSelect = document.getElementById("district");
  const geoBtn = document.getElementById("geo-search-btn");

  // REGION_MAP은 regions.js에서 제공
  if (typeof REGION_MAP !== "object") {
    console.error("REGION_MAP이 정의되지 않았습니다. regions.js 로드를 확인하세요.");
    return;
  }

  // 1. 시 셀렉트 박스 채우기
  Object.keys(REGION_MAP)
    .sort()
    .forEach((cityName) => {
      const option = document.createElement("option");
      option.value = cityName;
      option.textContent = cityName;
      citySelect.appendChild(option);
    });

  // 2. 시 선택 시 구 채우기
  citySelect.addEventListener("change", () => {
    const selectedCity = citySelect.value;
    districtSelect.innerHTML = "";

    if (!selectedCity) {
      districtSelect.disabled = true;
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "먼저 시를 선택하세요";
      districtSelect.appendChild(defaultOption);
      return;
    }

    const districts = REGION_MAP[selectedCity] || [];
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "구를 선택하세요";
    districtSelect.appendChild(defaultOption);

    districts.forEach((guName) => {
      const option = document.createElement("option");
      option.value = guName;
      option.textContent = guName;
      districtSelect.appendChild(option);
    });

    districtSelect.disabled = false;
  });

  // 3. 폼 제출 시 (시/구 기반 검색)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = citySelect.value;
    const district = districtSelect.value;

    if (!city) {
      alert("시/도를 선택해주세요!");
      return;
    }
    if (!district) {
      alert("구(군)을 선택해주세요!");
      return;
    }

    const regionString = `${city} ${district}`;
    const params = new URLSearchParams();
    params.set("region", regionString);

    window.location.href = `search.html?${params.toString()}`;
  });

  // 4. 내 위치 기반 검색 버튼 동작
  if (geoBtn) {
    geoBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
        return;
      }

      geoBtn.disabled = true;
      const originalText = geoBtn.textContent;
      geoBtn.textContent = "내 위치 가져오는 중...";

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          const params = new URLSearchParams();
          params.set("lat", latitude);
          params.set("lng", longitude);
          params.set("mode", "nearby"); // 내 주변 검색 모드

          window.location.href = `search.html?${params.toString()}`;
        },
        (err) => {
          console.error(err);
          alert("위치 정보를 가져오지 못했습니다. 위치 권한을 허용했는지 확인해주세요.");
          geoBtn.disabled = false;
          geoBtn.textContent = originalText;
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  // ================== QR 코드 모달 ==================
  const qrToggleBtn = document.getElementById("qr-toggle-btn");
  const qrOverlay = document.getElementById("qr-overlay");
  const qrCloseBtn = document.getElementById("qr-close-btn");
  const qrBox = document.getElementById("qrcode");

  if (qrToggleBtn && qrOverlay && qrCloseBtn && qrBox) {
    let qrGenerated = false;

    // QR 코드에 넣을 URL (깃허브 페이지 메인 주소)
    function getQrUrl() {
      return "https://jeonghun-k.github.io/webp-test/webp%20team4/index.html";
    }

    function renderQr() {
      if (qrGenerated) return;
      qrBox.innerHTML = "";
      new QRCode(qrBox, {
        text: getQrUrl(),
        width: 170,
        height: 170
      });
      qrGenerated = true;
    }

    qrToggleBtn.addEventListener("click", () => {
      qrOverlay.style.display = "flex";
      renderQr();
    });

    qrCloseBtn.addEventListener("click", () => {
      qrOverlay.style.display = "none";
    });

    qrOverlay.addEventListener("click", (e) => {
      if (e.target === qrOverlay) {
        qrOverlay.style.display = "none";
      }
    });
  }

  // ================== (옵션) 디버깅용: 설치 버튼 항상 보이게 하고 싶으면 여기서 ON ==================
  // const installBtn = document.getElementById("install-btn");
  // if (installBtn) {
  //   installBtn.style.display = "inline-flex";
  // }
});

// ================== PWA: 서비스 워커 등록 ==================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => {
        console.log("Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        console.log("Service Worker registration failed:", err);
      });
  });
}

// ================== PWA: 설치 버튼 (beforeinstallprompt) ==================
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  // 기본 자동 설치 배너 막기
  e.preventDefault();
  deferredPrompt = e;
  console.log("beforeinstallprompt fired");

  const installBtn = document.getElementById("install-btn");
  if (installBtn) {
    installBtn.style.display = "inline-flex"; // 버튼 표시
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt(); // 설치 팝업 띄우기
      const choice = await deferredPrompt.userChoice;
      console.log("PWA install choice:", choice.outcome);

      deferredPrompt = null;
      installBtn.style.display = "none";
    });
  }
});
