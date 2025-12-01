document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const citySelect = document.getElementById("city");
  const districtSelect = document.getElementById("district");
  const geoBtn = document.getElementById("geo-search-btn");

  // ✅ REGION_MAP은 regions.js에서 제공
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

  // ✅ 4. 내 위치 기반 검색 버튼 동작
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
          params.set("mode", "nearby"); // 내 주변 검색 모드 표시

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
});

// ================== QR 코드 모달 ==================
document.addEventListener("DOMContentLoaded", () => {
  const qrToggleBtn = document.getElementById("qr-toggle-btn");
  const qrOverlay = document.getElementById("qr-overlay");
  const qrCloseBtn = document.getElementById("qr-close-btn");
  const qrBox = document.getElementById("qrcode");

  if (!qrToggleBtn || !qrOverlay || !qrCloseBtn || !qrBox) return;

  let qrGenerated = false;

  // QR 코드에 넣을 URL (현재 메인 페이지 주소)
  function getQrUrl() {
    const url = window.location.origin + window.location.pathname;
    return url;
  }

  function renderQr() {
    if (qrGenerated) return;         // 이미 한 번 만든 적 있으면 다시 안 만듦
    qrBox.innerHTML = "";            // 혹시 남아있던 내용 비우기 (중복 방지)
    new QRCode(qrBox, {
      text: getQrUrl(),
      width: 170,
      height: 170,
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
});