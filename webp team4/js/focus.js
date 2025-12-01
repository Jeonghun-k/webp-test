// js/focus.js

// ================== 🔐 포커스 세션 저장 관련 설정 ==================

// 로그인 사용자 정보
let currentUser = null;
try {
  const raw = localStorage.getItem("studyspotUser");
  currentUser = raw ? JSON.parse(raw) : null;
} catch (e) {
  console.warn("사용자 정보 파싱 실패:", e);
}

// 세션 저장 키 : studyspot.sessions_이메일
function getSessionKey() {
  if (!currentUser || !currentUser.email) return null;
  return `studyspot.sessions_${currentUser.email}`;
}

function getSessionList() {
  const key = getSessionKey();
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("세션 목록 파싱 실패:", e);
    return [];
  }
}

function saveSessionList(list) {
  const key = getSessionKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(list));
}

// 세션 하나 추가
function addFocusSession({
  name,
  addr,
  lat,
  lng,
  durationMinutes,
  startedAt,
  endedAt,
}) {
  if (!currentUser) {
    console.log("로그인 안 되어 있어서 세션을 저장하지 않았습니다.");
    return;
  }
  const list = getSessionList();
  list.push({
    id: Date.now(),
    name,
    addr,
    lat,
    lng,
    durationMinutes,
    startedAt,
    endedAt,
  });
  saveSessionList(list);
}

// ============= URL에서 넘어온 장소 정보 읽기 =============

const focusParams = new URLSearchParams(window.location.search);
const focusPlaceName = focusParams.get("name") || "포커스 플라이트 세션";
const focusPlaceAddr = focusParams.get("addr") || "장소 정보 없음";
const focusPlaceLat = focusParams.get("lat") || "";
const focusPlaceLng = focusParams.get("lng") || "";

// 세션 메타데이터
let focusStartTime = null; // 실제 시작 시간
let focusDurationMinutes = 0; // 세션 길이(분)

let totalSeconds = 0;
let remainingSeconds = 0;
let timerId = null;

const placeNameEl = document.getElementById("focus-place-name");
const placeAddrEl = document.getElementById("focus-place-addr");
const timerDisplayEl = document.getElementById("timer-display");
const progressBarEl = document.getElementById("timer-progress-bar");
const flightDepartureEl = document.getElementById("flight-departure");
const flightArrivalEl = document.getElementById("flight-arrival");
const flightStatusEl = document.getElementById("flight-status");

const presetButtons = document.querySelectorAll(".preset-btn");
const customMinutesInput = document.getElementById("custom-minutes");
const startBtn = document.getElementById("focus-start-btn");
const stopBtn = document.getElementById("focus-stop-btn");

// 1. URL 파라미터에서 장소 정보 읽기 + 화면에 표시
(function initPlaceInfo() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "포커스 플라이트 세션";
  const addr = params.get("addr") || "장소 정보 없음";

  placeNameEl.textContent = name;
  placeAddrEl.textContent = addr;
})();

// 2. 프리셋 버튼 클릭 → 시간 세팅
presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    presetButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const min = parseInt(btn.dataset.min, 10) || 25;
    customMinutesInput.value = min;
  });
});

// 3. 시간 포맷
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// 4. 상태 업데이트
function updateFlightStatus() {
  if (!totalSeconds || totalSeconds === 0) {
    flightStatusEl.textContent = "대기 중";
    return;
  }
  const progress = 1 - remainingSeconds / totalSeconds;
  if (remainingSeconds === 0) {
    flightStatusEl.textContent = "착륙 완료 ✨";
  } else if (progress < 0.2) {
    flightStatusEl.textContent = "탑승 중 · 이륙 준비 ✈";
  } else if (progress < 0.8) {
    flightStatusEl.textContent = "순항 중 · 집중 유지!";
  } else {
    flightStatusEl.textContent = "착륙 준비 · 마무리 정리";
  }
}

// 5. 1초마다 호출되는 tick 함수
function tick() {
  if (remainingSeconds <= 0) {
    clearInterval(timerId);
    timerId = null;
    remainingSeconds = 0;
    timerDisplayEl.textContent = formatTime(0);
    progressBarEl.style.width = "100%";
    updateFlightStatus();
    startBtn.disabled = false;
    stopBtn.disabled = true;

    // ✅ 여기서 세션 저장
    const end = new Date();
    // 시작시간이 없으면(혹시 오류 대비) 타이머 길이로 역산
    const start =
      focusStartTime ||
      new Date(end.getTime() - (totalSeconds || 60) * 1000);

    const duration =
      focusDurationMinutes && !isNaN(focusDurationMinutes)
        ? focusDurationMinutes
        : Math.round((end.getTime() - start.getTime()) / 60000);

    addFocusSession({
      name: focusPlaceName,
      addr: focusPlaceAddr,
      lat: focusPlaceLat,
      lng: focusPlaceLng,
      durationMinutes: duration,
      startedAt: start.toISOString(),
      endedAt: end.toISOString(),
    });

    return;
  }

  remainingSeconds -= 1;

  timerDisplayEl.textContent = formatTime(remainingSeconds);
  const progress = 1 - remainingSeconds / totalSeconds;
  progressBarEl.style.width = `${(progress * 100).toFixed(1)}%`;
  updateFlightStatus();
}

// 6. 비행 시작 버튼
startBtn.addEventListener("click", () => {
  const minutes = parseInt(customMinutesInput.value, 10) || 25;

  if (!minutes || minutes <= 0) {
    alert("집중할 시간을 분 단위로 입력해주세요.");
    return;
  }

  // ✅ 세션 정보 기록
  focusDurationMinutes = minutes;
  focusStartTime = new Date();

  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;

  const now = new Date();
  const arrival = new Date(now.getTime() + totalSeconds * 1000);
  flightDepartureEl.textContent = now.toTimeString().slice(0, 5);
  flightArrivalEl.textContent = arrival.toTimeString().slice(0, 5);

  timerDisplayEl.textContent = formatTime(remainingSeconds);
  progressBarEl.style.width = "0%";
  updateFlightStatus();

  if (timerId) clearInterval(timerId);
  timerId = setInterval(tick, 1000);

  startBtn.disabled = true;
  stopBtn.disabled = false;
});

// 7. 중단 버튼
stopBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  flightStatusEl.textContent = "중단됨";
  startBtn.disabled = false;
  stopBtn.disabled = true;
});