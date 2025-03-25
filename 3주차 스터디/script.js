// 탭 전환 버튼 요소들을 가져옴
const stopwatchTab = document.getElementById("showStopwatch");
const calculatorTab = document.getElementById("showCalculator");
const stopwatchSection = document.getElementById("stopwatchSection");
const calculatorSection = document.getElementById("calculatorSection");

// 스톱워치 탭 클릭 시 -> 스톱워치 화면 보이게
stopwatchTab.addEventListener("click", () => {
  stopwatchSection.classList.add("active"); // 스톱워치 섹션 보이기
  calculatorSection.classList.remove("active"); // 계산기 섹션 숨기기
});

// 계산기 탭 클릭 시 ->  계산기 화면 보이게
calculatorTab.addEventListener("click", () => {
  calculatorSection.classList.add("active"); // 계산기 섹션 보이기
  stopwatchSection.classList.remove("active"); // 스톱워치 섹션 숨기기
});

// 스톱워치 기능 구현

let time = 0; // 총 경과 시간 (초 단위)
let interval; // setInterval의 ID (정지 시 사용)
let isRunning = false; // 중복 실행 방지 플래그

// HTML에서 시간 표시, 버튼 요소 가져오기
const display = document.getElementById("display");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

// 숫자(초)를 -> 00:00 형태로 바꾸는 함수
const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0"); // 분 계산
  const seconds = String(totalSeconds % 60).padStart(2, "0"); // 초 계산
  return `${minutes}:${seconds}`; // 형식에 맞게 반환
};

// 실제로 화면에 시간 보여주는 함수
const updateDisplay = () => {
  display.textContent = formatTime(time);
};

// 시작 버튼 클릭 시
startBtn.addEventListener("click", () => {
  if (isRunning) return; // 이미 실행 중이면 다시 실행하지 않음
  isRunning = true; // 실행 상태로 변경

  interval = setInterval(() => {
    // 1초마다 실행되는 함수
    time++; // 경과 시간 1초 증가
    updateDisplay(); // 화면 갱신
  }, 1000); // 1000ms = 1초
});

// 정지 버튼 클릭 시
stopBtn.addEventListener("click", () => {
  clearInterval(interval); // setInterval 멈춤
  isRunning = false; // 실행 중 아님
});

// 초기화 버튼 클릭 시
resetBtn.addEventListener("click", () => {
  clearInterval(interval); // 타이머 멈춤
  isRunning = false;
  time = 0; // 시간 초기화
  updateDisplay(); // 화면 00:00 으로 초기화
});

// 시작 시 초기 상태로 00:00 표시
updateDisplay();

// 계산기 기능 구현

const calcDisplay = document.getElementById("calcDisplay"); // 계산기 화면 요소 가져오기
const calcButtons = document.querySelectorAll(".buttons button"); // 모든 계산기 버튼 가져오기

let input = ""; // 현재 입력 중인 숫자나 수식 문자열
let operator = ""; // 현재 선택된 연산자 (+, -, *, /)
let firstNum = ""; // 첫 번째 숫자 저장용
let secondNum = ""; // 두 번째 숫자 저장용
let isResultShown = false; // = 누른 직후 상태를 나타내는 플래그

// 버튼 하나씩 반복하며 클릭 이벤트 연결
calcButtons.forEach((button) => {
  const value = button.textContent; // 버튼에 써 있는 글자(예: 1, +, = 등)

  button.addEventListener("click", () => {
    // C(초기화) 버튼 눌렀을 때
    if (value === "C") {
      input = "";
      operator = "";
      firstNum = "";
      secondNum = "";
      isResultShown = false;
      calcDisplay.textContent = "0";

      // 연산자 버튼 눌렀을 때
    } else if (["+", "-", "*", "/"].includes(value)) {
      if (firstNum === "") {
        firstNum = input; // 입력 중인 숫자를 첫 번째 숫자로 저장
        operator = value; // 현재 연산자 저장
        input = ""; // 다음 숫자 입력 준비
      } else if (operator && input !== "") {
        // 두 번째 숫자 입력 후 또 연산자 누르면 → 이전 결과 계산
        secondNum = input;
        const result = calculate(firstNum, operator, secondNum); // 연산 수행
        calcDisplay.textContent = result;
        firstNum = result.toString(); // 결과를 첫 번째 숫자로 저장
        operator = value; // 새 연산자 저장
        input = ""; // 다음 숫자 입력 준비
      }

      // = 버튼 눌렀을 때
    } else if (value === "=") {
      if (firstNum !== "" && operator !== "" && input !== "") {
        secondNum = input;
        const result = calculate(firstNum, operator, secondNum);
        calcDisplay.textContent = result;
        input = result.toString(); // 결과는 다음 계산을 위한 입력값이 됨
        firstNum = "";
        operator = "";
        isResultShown = true; // = 이후 새로운 입력 감지용
      }

      // 숫자 버튼 눌렀을 때
    } else {
      if (isResultShown) {
        input = value; // = 이후 입력이 시작되면 input을 새로 초기화
        isResultShown = false;
      } else {
        input += value; // 숫자 계속 이어 붙이기
      }
      calcDisplay.textContent = input;
    }
  });
});

// 실제 연산 처리 함수
const calculate = (num1, op, num2) => {
  const a = Number(num1); // 문자열을 숫자로 변환
  const b = Number(num2);

  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? "0으로 나눌 수 없습니다" : a / b;

  return "오류"; // 예상치 못한 연산자일 경우
};
