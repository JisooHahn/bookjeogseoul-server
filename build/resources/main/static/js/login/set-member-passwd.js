// 아이디 입력란에 포커스가 갔을 때, label의 border 색상을 바꿔주는 코드
// value가 0보다 클 때 clearBtn을 보여주고, 0일 때는 숨김
// x 눌럿을때 inputId.value 사라짐
const inputId = document.getElementById("bjs-passwd");
const idLabel = document.querySelector(".input-label-passwd");
const clearBtn = document.querySelector("#clear-button-passwd");
const checkBtn = document.querySelector("#check-btn");

inputId.addEventListener("focus", () => {
    idLabel.style.borderColor = "rgba(0, 221, 109)";
    if (inputId.value.length > 0) {
        clearBtn.style.display = "block";
    } else {
        clearBtn.style.display = "none";
    }
});
inputId.addEventListener("blur", () => {
    idLabel.style.borderColor = "";
    clearBtn.style.display = "none";
});
inputId.addEventListener("input", () => {
    if (inputId.value.length > 0) {
        clearBtn.style.display = "block";
        activeLoginBtn()
    } else {
        clearBtn.style.display = "none";
        activeLoginBtn()
    }
});
clearBtn.addEventListener("mousedown", (e) => {
    clearBtn.style.display = "none";
    e.preventDefault();
    inputId.value = "";
    activeLoginBtn();
});

// 비밀번호 입력란에 포커스가 갔을 때, label의 border 색상을 바꿔주는 코드
// value가 0보다 클 때 clearBtn을 보여주고, 0일 때는 숨김
// x 눌럿을때 inputpw.value 사라짐
const inputPw = document.getElementById("bjs-pw");
const pwLabel = document.querySelector(".input-label-pw");
const cleartBtnPw = document.querySelector("#clear-button-pw");

inputPw.addEventListener("focus", () => {
    pwLabel.style.borderColor = "rgba(0, 221, 109)";
    if (inputPw.value.length > 0) {
        cleartBtnPw.style.display = "block";
    } else {
        cleartBtnPw.style.display = "none";
    }
});

inputPw.addEventListener("blur", () => {
    pwLabel.style.borderColor = "";
    if (inputPw.value.length >= 0) {
        cleartBtnPw.style.display = "none";
    }
});

inputPw.addEventListener("input", () => {
    if (inputPw.value.length > 0) {
        cleartBtnPw.style.display = "block";
        activeLoginBtn()
    } else {
        cleartBtnPw.style.display = "none";
        activeLoginBtn()
    }
});

cleartBtnPw.addEventListener("mousedown", (e) => {
    clearBtn.style.display = "none";
    e.preventDefault();
    inputPw.value = "";
    activeLoginBtn();
});

// 아이디 비밀번호 value가 없으면 로그인 활성화 안함
// 반대로 있으면 활성화함
const nextBtn = document.querySelector("#login-btn");

const activeLoginBtn = () => {
    if (inputId.value.length > 0 && inputPw.value.length > 0 && inputId.value.length === inputPw.value.length) {
        checkBtn.style.opacity = "1";
        checkBtn.style.cursor = "pointer";
    } else {
        checkBtn.style.opacity = ".4";
        checkBtn.style.cursor = "not-allowed";
    }

};
inputId.addEventListener("input", activeLoginBtn);
inputPw.addEventListener("input", activeLoginBtn);

// 모달 테스트
// 모달 창을 띄우기 위한 코드
// 안쓸거면 주석 하면됨
const modal = document.querySelector("#modal");
const modalCloseBtn = document.querySelector(
    "#modal-wrap > .modal-footer > button"
);
const modalHeader = document.querySelector(".modal-header > strong");
const modalBody = document.querySelector(".modal-body > div > p");
const changeForm = document.querySelector("#change-passwd-form")

modalCloseBtn.addEventListener("click", () => {
    changeForm.submit();
    modal.classList.add("fade-out");
    modal.classList.remove("fade-in");
    setTimeout(() => {
        modal.style.display = "none";
    }, 500);
});

console.log(changeForm)

checkBtn.addEventListener("click", () => {
    modalBody.innerText = "변경성공!"
    modal.style.display = "flex";
    modal.classList.add("fade-in");
});



