// Updated Scientific Calculator Script with Sound, Vibration, and Full Mode Compatibility

document.addEventListener("DOMContentLoaded", function () {
  let currentOperand = "0";
  let previousOperand = "";
  let operation = undefined;
  let resetScreen = false;
  let isRadians = false;

  const currentOperandElement = document.getElementById("current-operand");
  const previousOperandElement = document.getElementById("previous-operand");
  const body = document.body;
  const modeToggle = document.querySelector(".mode-toggle");
  const angleToggle = document.querySelector(".angle-toggle");

  const clickSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_3c8d47dd45.mp3?filename=button-124476.mp3");

  function playFeedback() {
    if (navigator.vibrate) navigator.vibrate(20);
    clickSound.currentTime = 0;
    clickSound.play();
  }

  function bindEvents() {
    document.querySelectorAll("[data-number]").forEach((btn) => {
      btn.onclick = () => {
        playFeedback();
        const number = btn.getAttribute("data-number");
        if (resetScreen || currentOperand === "0") {
          currentOperand = number;
          resetScreen = false;
        } else if (!(number === "." && currentOperand.includes("."))) {
          currentOperand += number;
        }
        updateDisplay();
      };
    });

    document.querySelectorAll("[data-operation]").forEach((btn) => {
      btn.onclick = () => {
        playFeedback();
        const op = btn.getAttribute("data-operation");
        if (!op) return;

        if (op === "AC") return clear();
        if (op === "DEL") return deleteNumber();
        if (op === "=") return compute();

        if (["x²", "x³", "1/x", "10^x", "√", "!", "sin", "cos", "tan", "log", "ln"].includes(op)) {
          operation = op;
          compute();
        } else {
          if (operation !== undefined) compute();
          operation = op;
          previousOperand = currentOperand;
          currentOperand = "0";
        }
        updateDisplay();
      };
    });
  }

  modeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const icon = modeToggle.querySelector(".mode-icon i");
    if (body.classList.contains("light-mode")) {
      icon.classList.replace("fa-sun", "fa-moon");
      modeToggle.querySelector(".mode-text").textContent = "Dark Mode";
    } else {
      icon.classList.replace("fa-moon", "fa-sun");
      modeToggle.querySelector(".mode-text").textContent = "Light Mode";
    }
  });

  if (angleToggle) {
    angleToggle.addEventListener("click", () => {
      playFeedback();
      isRadians = !isRadians;
      angleToggle.textContent = isRadians ? "RAD" : "DEG";
    });
  }

  function compute() {
    let result;
    const current = parseFloat(currentOperand);
    const prev = parseFloat(previousOperand);

    switch (operation) {
      case "+": result = prev + current; break;
      case "-": result = prev - current; break;
      case "×": result = prev * current; break;
      case "÷": result = current === 0 ? "Error" : prev / current; break;
      case "%": result = prev % current; break;
      case "^": result = Math.pow(prev, current); break;
      case "x²": result = Math.pow(current, 2); break;
      case "x³": result = Math.pow(current, 3); break;
      case "1/x": result = current === 0 ? "Error" : 1 / current; break;
      case "10^x": result = Math.pow(10, current); break;
      case "√": result = current < 0 ? "Error" : Math.sqrt(current); break;
      case "!": result = factorial(current); break;
      case "sin": result = Math.sin(isRadians ? current : degToRad(current)); break;
      case "cos": result = Math.cos(isRadians ? current : degToRad(current)); break;
      case "tan": result = Math.tan(isRadians ? current : degToRad(current)); break;
      case "log": result = current <= 0 ? "Error" : Math.log10(current); break;
      case "ln": result = current <= 0 ? "Error" : Math.log(current); break;
      default: return;
    }

    currentOperand =
      typeof result === "number"
        ? Math.round(result * 1e10) / 1e10 + ""
        : result;
    previousOperand = "";
    operation = undefined;
    resetScreen = true;
    updateDisplay();
  }

  function clear() {
    playFeedback();
    currentOperand = "0";
    previousOperand = "";
    operation = undefined;
    updateDisplay();
  }

  function deleteNumber() {
    playFeedback();
    currentOperand = currentOperand.length > 1 ? currentOperand.slice(0, -1) : "0";
    updateDisplay();
  }

  function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return "Error";
    return n === 0 ? 1 : n * factorial(n - 1);
  }

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function updateDisplay() {
    currentOperandElement.textContent = formatNumber(currentOperand);
    if (operation) {
      const isUnary = ["x²", "x³", "1/x", "10^x", "√", "!", "sin", "cos", "tan", "log", "ln"].includes(operation);
      previousOperandElement.textContent = isUnary
        ? `${operation}(${formatNumber(currentOperand)})`
        : `${formatNumber(previousOperand)} ${operation}`;
    } else {
      previousOperandElement.textContent = "";
    }
  }

  function formatNumber(num) {
    if (num === "Error" || num === "undefined") return num;
    const parsed = parseFloat(num);
    if (isNaN(parsed)) return num;
    return parsed.toLocaleString("en-US", { maximumFractionDigits: 10 });
  }

  // Initial setup
  bindEvents();
  updateDisplay();
});
