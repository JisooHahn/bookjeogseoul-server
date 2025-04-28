document.addEventListener("DOMContentLoaded", function () {
    // 도서페이지에서 isbn을 받아왔으면 검색 스킵
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedIsbn = urlParams.get('isbn');

    if (preSelectedIsbn) {
        (async () => {
            try {
                const books = await postWriteService.searchBooks(preSelectedIsbn);
                if (books.length > 0) {
                    const book = books[0]; // 첫 번째 결과를 선택

                    // 책 선택 처리 (아까 만든 book layout에 넣기)
                    postWriteLayout.showPreSelectedBook(book);

                    // 독후감 입력폼 열기 (숨겨진 것들 표시)
                    noSelectedBook.style.display = "none";
                    selectedBook.style.display = "flex";
                    components.forEach((component) => {
                        component.style.display = "block";
                    });

                    // isSelected 여부 조회해서 출품 스위치 표시/숨기기
                    const selected = await postWriteService.isSelected(book.isbn);
                    const selectedInputHidden = document.querySelector("input#selectedInput");
                    selectedInputHidden.value = selected;

                    const selectedCheck = document.querySelector("li.selectedCheck");
                    selectedCheck.style.display = selected ? "flex" : "none";

                } else {
                    console.warn("해당 ISBN으로 책을 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("책 자동 선택 실패", error);
            }
        })();
    }

    // input에 입력할 때마다 그 검색어로 도서 검색
    const searchInput = document.querySelector("#input-search");

    let searchTimeout;

    searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);

        const keyword = e.target.value.trim();
        if (keyword === "") return; // 아무것도 없으면 검색 안 함

        searchTimeout = setTimeout(async () => {
            try {
                const books = await postWriteService.searchBooks(keyword);
                await postWriteLayout.showBookList(books); // 리스트 렌더링
                setUpBookClickEvents();
            } catch (error) {
                console.error("책 검색 실패", error);
            }
        }, 300); // 0.3초 딜레이 후 검색
    });

    // 요소들 가져오기
    const dateInput = document.getElementById("dateInput");
    const dateDisplay = document.querySelector(".date");
    const showDatePickerButton = document.getElementById("showDatePicker");
    const calendarOverlay = document.getElementById("calendarOverlay");
    const calendarContainer = document.getElementById("calendarContainer");

    // flatpickr를 range 모드로 초기화
    // 초기 시점에 calendarContainer가 display:none 인 상태일 수 있으니,
    // 캘린더를 강제로 새로 그릴 수 있도록 후에 redraw를 호출합니다.
    const fp = flatpickr(dateInput, {
        mode: "range",
        dateFormat: "Y.m.d", // 예: 2025.04.03 형식
        appendTo: calendarContainer,
        onChange: function (selectedDates, dateStr, instance) {
            // 날짜가 두 개 모두 선택되면
            if (selectedDates.length === 2) {
                const start = instance.formatDate(selectedDates[0], "Y.m.d");
                const end = instance.formatDate(selectedDates[1], "Y.m.d");
                const rangeText = `${start} ~ ${end}`;

                // p 태그에 선택된 기간 업데이트 및 active 클래스 추가
                dateDisplay.textContent = rangeText;
                dateDisplay.classList.add("active");

                // 숨겨진 input에도 값 저장 (필요 시 활용)
                dateInput.value = rangeText;

                // 시작일/종료일 hidden input에 각각 저장
                document.getElementById("hiddenStartDate").value = start;
                document.getElementById("hiddenEndDate").value = end;

                // 캘린더 닫고 오버레이 숨김
                fp.close();
                calendarOverlay.style.display = "none";
            }
        },
    });

    // 버튼 클릭 시 오버레이를 보이고, 캘린더 열기
    showDatePickerButton.addEventListener("click", function () {
        // 오버레이와 캘린더 컨테이너 보이기
        calendarOverlay.style.display = "flex";

        // 잠깐 delay를 주어 브라우저가 오버레이를 렌더링하도록 함
        setTimeout(function () {
            fp.redraw(); // 캘린더가 올바르게 그려지도록 강제로 redraw
            fp.open(); // 캘린더 열기
        }, 10);
    });

    // 오버레이 클릭 시 배경만 닫기
    calendarOverlay.addEventListener("click", function () {
        calendarOverlay.style.display = "none";
    });


// 독후감 제목 input에 입력하면 글자수가 갱신됨
const titleInput = document.querySelector("input#textarea-title");
const titleCount = document.querySelector(".post-title .message-wrap>span");

titleInput.addEventListener("input", (e) => {
    titleCount.innerText = `${e.target.value.length}` + " / 40";
});

// 독후감 내용 input에 입력하면 글자수 갱신
const contentInput = document.querySelector("textarea#textarea-content");
const contentCount = document.querySelector(".post-content .message-wrap>span");

contentInput.addEventListener("input", (e) => {
    contentCount.innerText = `${e.target.value.length}` + " / 2000";
});

// 책 선택 모달창에서 책 고르면 클래스, 스타일 변경
    const setUpBookClickEvents = () => {
        const books = document.querySelectorAll(".user-booklist.books-item");
        const addButton = document.querySelector(".add-btn");

        books.forEach((book) => {
            book.addEventListener("click", () => {
                const isActive = book.classList.contains("active");

                // 이미 선택된 걸 다시 클릭한 경우엔 해제
                if (isActive) {
                    console.log("해제");
                    book.classList.remove("active");
                    addButton.disabled = true;
                } else {
                    // 다른 거 선택된 경우에 모두 해제 후 현재만 활성화
                    books.forEach((b) => b.classList.remove("active"));
                    book.classList.add("active");
                    addButton.disabled = false;
                }
            });
        });
    }


// 검색된 책이 없으면 없다는 페이지 보여짐
const searchList = document.querySelector(".search-list");
const bookList = document.querySelector(".modal-content");

const checkBookItems = () => {
    const items = bookList.querySelectorAll(".books-item");

    // 조회 결과가 없으면
    if (items.length === 0) {
        searchList.style.display = "block";
    } else {
        searchList.style.display = "none";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    checkBookItems();
});

// 닫기 버튼 누르면 모달창 꺼짐
const modalOffButton = document.querySelector(".close-btn");

const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");

modalOffButton.addEventListener("click", (e) => {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
});

// 책 추가, 변경 버튼 누르면 모달창이 뜸
const modalOnButton = document.querySelector("button.add-book-button");
const changeBookButton = document.querySelector("button.change-button");

modalOnButton.addEventListener("click", (e) => {
    modal.style.display = "flex";
    modalOverlay.style.display = "flex";
});

changeBookButton.addEventListener("click", (e) => {
    modal.style.display = "flex";
    modalOverlay.style.display = "flex";
});

// 책 선택 저장버튼 누르면 모달이 꺼지면서 숨어져있던 요소들이 나옴
const modalSaveButton = document.querySelector(".add-btn");
const components = document.querySelectorAll(".component:not(.add-book)");
const noSelectedBook = document.querySelector(".add-book>.box");
const selectedBook = document.querySelector(".book-container");

// 숨겨진 input (선정도서 여부 저장할 곳)
    const selectedCheck = document.querySelector("li.selectedCheck");

    modalSaveButton.addEventListener("click", async (e) => {
        const selectedBookItem = document.querySelector(".user-booklist.books-item.active");

        if (!selectedBookItem) {
            alert("책을 선택해 주세요.");
            return;
        }

        const isbn = selectedBookItem.dataset.isbn; // ✅ 선택한 책의 ISBN 가져오기
        if (!isbn) {
            alert("선택한 책에 ISBN 정보가 없습니다.");
            return;
        }

        try {
            const selected = await postWriteService.isSelected(isbn); // ✅ 선정도서 여부 조회
            const selectedInputHidden = document.querySelector("input#selectedInput"); // ✅ 숨겨진 input
            selectedInputHidden.value = selected; // ✅ 숨겨진 input에 true/false 저장

            if(selected){
                selectedCheck.style.display = "flex";
            } else{
                selectedCheck.style.display = "none";
            }
            console.log("선정도서 여부:", selected);

        } catch (error) {
            console.error("선정도서 여부 조회 실패", error);
        }

        // ✅ 기존 모달 닫기 동작들
        modal.style.display = "none";
        modalOverlay.style.display = "none";
        noSelectedBook.style.display = "none";
        selectedBook.style.display = "flex";
        components.forEach((component) => {
            component.style.display = "block";
        });

        const titleElementTop = document.querySelector(".title.book-name .book-title");
        const titleElementBottom = document.querySelector(".book-container .book-name");
        const produceElement = document.querySelector(".book-container .book-produce");
        const infoElement = document.querySelector(".book-container .book-info");
        const coverImgElement = document.querySelector(".book-container img");
        const bookContainer = document.querySelector(".book-container");

        // insert용 hidden input
        const bookIsbnInput = document.getElementById("hiddenIsbn");
        const hiddenBookTitle = document.getElementById("hiddenBookTitle");

        // 선택한 책 item에서 데이터 꺼내기
        const title = selectedBookItem.querySelector(".metadata .title").innerText;
        const author = selectedBookItem.querySelector(".metadata .author").innerText;
        const cover = selectedBookItem.querySelector(".book-picture img").src;

        const publishDate = `${selectedBookItem.dataset.publishDate} 출간` || "출간일 정보 없음";

        // 책 상세 정보 영역 반영
        titleElementTop.innerText = title;
        titleElementBottom.innerText = title;
        produceElement.innerText = `${author} 지음 · ${selectedBookItem.dataset.publisher || "출판사 없음"}`;
        infoElement.innerText = `${publishDate}`;
        coverImgElement.src = cover;
        bookContainer.style.setProperty("--background-image", `url('${cover}')`);
        bookIsbnInput.value = selectedBookItem.dataset.isbn;
        hiddenBookTitle.value = title;
    });

// 모달창 검색어가 있으면 x버튼이 뜸
// 일단 input에 입력해야 버튼이 뜸
const searchEraseButton = document.querySelector(".clear-button");
const modalSearchInput = document.querySelector(".modal #input-search");

modalSearchInput.addEventListener("input", (e) => {
    if (e.target.value.trim() !== "") {
        searchEraseButton.style.display = "flex";
    } else {
        searchEraseButton.style.display = "none";
    }
});

searchEraseButton.addEventListener("click", (e) => {
    modalSearchInput.value = "";
    e.target.style.display = "none";
});

const imageInputButton = document.querySelector(".add-box > button");
const imageInput = document.querySelector(".input-file");
const noImageBox = document.querySelector(".add-box");
const imagesBox = document.querySelector(".sentence > .images");
const previewList = document.querySelector(".images ul"); // 이미지 리스트 영역
const imageCountText = document.querySelector(".image-count"); // 이미지 개수 표시용 요소 (있다면)
const imageAddButton = document.querySelector(".images .add-button");

// 파일 추가 버튼 클릭 시 input[type=file]을 강제로 열어줌
imageInputButton.addEventListener("click", () => {
    imageInput.click();
});

imageAddButton.addEventListener("click", () => {
    imageInput.click();
});

// 최대 5mb의 파일까지만 올라가게 용량 제한
const maxFileSize = 5 * 1024 * 1024; // 5MB (byte 단위)

// 파일 input 값이 변경되었을 때 실행됨
imageInput.addEventListener("change", (e) => {
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    const files = Array.from(imageInput.files);
    const validFiles = [];
    const currentCount = previewList.querySelectorAll("li.item").length;

    for (const file of files) {
        const ext = file.name.split(".").pop().toLowerCase();

        // 지정한 이미지 형식이 아니면
        if (!allowedExtensions.includes(ext)) {
            alert(`.` + ext + `은(는) 지원하지 않는 형식입니다.`);
            continue;
        }

        // 이미지가 최대 용량을 넘어가면
        if (file.size > maxFileSize) {
            alert("이미지 크기는 5MB 이하만 업로드할 수 있습니다.");
            continue;
        }

        // 이미지 개수가 10개를 초과하면
        if (currentCount + validFiles.length >= 10) {
            alert("이미지는 최대 10개까지 등록할 수 있습니다.");
            break;
        }

        validFiles.push(file);
        // 개수 반영
        document.querySelector(".count > strong").innerText = `${
            currentCount + validFiles.length
        }`;
    }

    // 유효한 파일이 없으면 아무것도 하지 않음
    if (validFiles.length === 0) {
        imageInput.value = ""; // 초기화
        return;
    }

    // 이미지가 하나라도 있다면 영역 전환
    noImageBox.style.display = "none";
    imagesBox.style.display = "block";

    // 유효한 파일들을 이미지 리스트로 추가
    validFiles.forEach((file, index) => {
        const imageUrl = URL.createObjectURL(file);

        const li = document.createElement("li");
        li.className = "item";
        li.innerHTML = `
        <img src="${imageUrl}">
        <div class="mds-input memo">
            <label>
                <div class="inner">
                    <div class="input">
                        <input type="text" autocomplete="off" placeholder="나만의 메모를 남겨보세요" class="mds-input-field" maxlength="50" data-index="${index}"/>
                        <input 
                            type="hidden" 
                            name="fileList[${index}].fileText" 
                            class="hidden-file-text" 
                        />
                    </div>
                    <button type="button" class="mds-icon-input-delete clear-button" style="display: none;"></button>
                </div>
            </label>
            <div class="message-wrap">
                <span class="length">0 / 50</span>
            </div>
        </div>
        <div class="buttons">
            <button type="button" class="change-image">
                <input type="file" accept=".jpg, .jpeg, .png" class="input-file" style="display: none;" />
                <svg data-v-a8c352e6="" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g data-v-a8c352e6="" clip-path="url(#clip0_5831_19518)"><rect data-v-a8c352e6="" x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="var(--text-01)"></rect> <path data-v-a8c352e6="" d="M4.7002 13.0003L8.81203 6.60709C9.16249 6.06219 9.93066 5.98928 10.3774 6.45852L13.7002 9.94887" stroke="var(--text-01)"></path> <rect data-v-a8c352e6="" x="3.7998" y="5.35254" width="2.4" height="2.35294" rx="1.17647" stroke="var(--text-01)"></rect></g> <defs data-v-a8c352e6=""><clipPath data-v-a8c352e6="" id="clip0_5831_19518"><rect data-v-a8c352e6="" width="12" height="10" fill="white" transform="translate(2 3)"></rect></clipPath></defs></svg>
                이미지 변경
            </button>
            <button type="button" class="delete">
                <svg data-v-a8c352e6="" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-a8c352e6="" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1C5.67157 1 5 1.67157 5 2.5V3H3.5H2.5C2.22386 3 2 3.22386 2 3.5C2 3.77614 2.22386 4 2.5 4H3V12.5C3 13.8807 4.11929 15 5.5 15H10.5C11.8807 15 13 13.8807 13 12.5V4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H12.5H11V2.5C11 1.67157 10.3284 1 9.5 1H6.5ZM10 3H6V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V3ZM4 12.5V4H5.5H10.5H12V12.5C12 13.3284 11.3284 14 10.5 14H5.5C4.67157 14 4 13.3284 4 12.5ZM6.5 6C6.5 5.72386 6.27614 5.5 6 5.5C5.72386 5.5 5.5 5.72386 5.5 6V12C5.5 12.2761 5.72386 12.5 6 12.5C6.27614 12.5 6.5 12.2761 6.5 12V6ZM8 5.5C8.27614 5.5 8.5 5.72386 8.5 6V12C8.5 12.2761 8.27614 12.5 8 12.5C7.72386 12.5 7.5 12.2761 7.5 12V6C7.5 5.72386 7.72386 5.5 8 5.5ZM10.5 6C10.5 5.72386 10.2761 5.5 10 5.5C9.72386 5.5 9.5 5.72386 9.5 6V12C9.5 12.2761 9.72386 12.5 10 12.5C10.2761 12.5 10.5 12.2761 10.5 12V6Z" fill="var(--danger)"></path></svg>
                삭제하기
            </button>
        </div>
    `;

        // 메모 입력할 때 숨은 input에도 같이 값 반영
        const memoInput = li.querySelector(".mds-input-field");
        const hiddenInput = li.querySelector(".hidden-file-text");

        memoInput.addEventListener("input", (e) => {
            hiddenInput.value = e.target.value; // 메모 내용 -> hidden input에 저장
        });

        // 이미지 안의 요소들
        const img = li.querySelector("img");
        const inputFile = li.querySelector(".input-file");
        const changeBtn = li.querySelector(".change-image");
        const deleteBtn = li.querySelector(".delete");
        const clearBtn = li.querySelector(".clear-button");
        const lengthSpan = li.querySelector(".length");

        // 이미지 변경
        changeBtn.addEventListener("click", () => inputFile.click());
        inputFile.addEventListener("change", () => {
            const file = inputFile.files[0];
            if (!file) return;

            const ext = file.name.split(".").pop().toLowerCase(); // 확장자명
            const allowed = ["jpg", "jpeg", "png"]; // 허용된 파일형식
            if (!allowed.includes(ext)) {
                alert("지원하지 않는 이미지 형식입니다.");
                return;
            }

            const newUrl = URL.createObjectURL(file);
            img.src = newUrl;
        });

        // 삭제 버튼
        deleteBtn.addEventListener("click", () => {
            li.remove();

            // 이미지가 모두 삭제되었는지 확인
            const remainingItems = previewList.querySelectorAll(".item");

            // 개수 반영
            document.querySelector(
                ".count > strong"
            ).innerText = `${remainingItems.length}`;

            if (remainingItems.length === 0) {
                // 이미지 0개일 때 창 바꾸기
                noImageBox.style.display = "flex";
                imagesBox.style.display = "none";
            }
        });

        // 메모 입력 시 길이 표시 & 클리어 버튼
        memoInput.addEventListener("input", () => {
            lengthSpan.textContent = `${memoInput.value.length} / 50`;
            clearBtn.style.display =
                memoInput.value.length > 0 ? "flex" : "none";
        });

        clearBtn.addEventListener("click", () => {
            memoInput.value = "";
            lengthSpan.textContent = "0 / 50";
            clearBtn.style.display = "none";
        });

        // 리스트에 추가
        previewList.appendChild(li);
    });

    // 이미지 개수 텍스트가 있다면 갱신
    if (imageCountText) {
        imageCountText.innerText =
            previewList.querySelectorAll("li.item").length;
    }

    // input 초기화 (동일 파일 다시 선택 가능)
    imageInput.value = "";
});

// 토스트 기능(잠깐 나타났다가 사라지는 창)
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<p>${message}</p>`;

    document.querySelector("#wrap").appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500); // 2.5초 후 자동 제거
}

// 발행 버튼을 누르면 숨겨진 설정창을 보여줌
const publishButton = document.querySelector("button.publish-btn");
const settingModal = document.querySelector(".post-settings.on");
const settingModalInner = settingModal.querySelector(".setting-modal");

publishButton.addEventListener("click", (e) => {
    e.stopPropagation(); // 버튼을 눌러도 밑의 window 이벤트가 발동 안 되게
    if (settingModal.style.display === "none") {
        settingModal.style.display = "block";
    }
});

// 발행 설정 모달창 밖을 누르면 꺼짐
window.addEventListener("click", (e) => {
    if (
        !settingModalInner.contains(e.target) &&
        settingModal.style.display !== "none"
    ) {
        settingModal.style.display = "none";
    }
});

// 설정의 물음표 아이콘을 누르면 정보가 뜸
const postQuestion = document.querySelector(".setting-option i.question");
const tooltip = document.querySelector("#tooltip");

postQuestion.addEventListener("click", (e) => {
    tooltip.style.display = tooltip.style.display !== "none" ? "none" : "block";
});

// 포스트 공개 버튼을 눌러서 껐다 킴
const postPublicButton = document.querySelector("label.mds-switch");
const postSubmitButton = document.querySelector("label.mds-switch.submit")
const checkbox = document.querySelector("input#publicInput");
const submitCheckbox = document.querySelector("input#selectedInput")

postPublicButton.addEventListener("click", (e) => {
    const label = e.currentTarget;

    // 토글 상태 반영
    setTimeout(() => {
        const hiddenPublicInput = document.getElementById("hiddenPublicInput");
        const hiddenSelectedInput = document.getElementById("hiddenSelectedInput");
        const selectedCheckbox = document.getElementById("selectedInput");
        const postSubmitLabel = document.querySelector("label.mds-switch.submit");

        if (checkbox.checked) {
            // 공개 ON
            label.classList.add("checked");
            checkbox.value = "true";
            hiddenPublicInput.value = "PUBLIC"; // ⭐️
        } else {
            // 공개 OFF
            label.classList.remove("checked");
            checkbox.value = "false";
            hiddenPublicInput.value = "PRIVATE"; // ⭐️

            // 공개 끄면 출품도 강제 OFF
            selectedCheckbox.checked = false;
            hiddenSelectedInput.value = "PRIVATE"; // ⭐️
            postSubmitLabel.classList.remove("checked");
        }
    }, 0);
});

postSubmitButton.addEventListener("click", (e) => {
    const label = e.currentTarget;

    // 토글 상태 반영
    setTimeout(() => {
        const hiddenPublicInput = document.getElementById("hiddenPublicInput");
        const hiddenSelectedInput = document.getElementById("hiddenSelectedInput");
        const selectedCheckbox = document.getElementById("selectedInput");

        if (hiddenPublicInput.value !== "PUBLIC") {
            // 공개 OFF 상태면 출품 못 켜게 하고 무조건 끔
            selectedCheckbox.checked = false;
            hiddenSelectedInput.value = "PRIVATE"; // ⭐️
            label.classList.remove("checked");
            showToast("공개 설정을 켜야 출품할 수 있습니다.");
            return;
        }

        if (selectedCheckbox.checked) {
            // 출품 ON
            label.classList.add("checked");
            hiddenSelectedInput.value = "PUBLIC"; // ⭐️
        } else {
            // 출품 OFF
            label.classList.remove("checked");
            hiddenSelectedInput.value = "PRIVATE"; // ⭐️
        }
    }, 0);
});

// 발행하기 버튼을 누르면 input에 입력이 다 되었는지 검사
const confirmButton = document.querySelector("button.post-btn");

confirmButton.addEventListener("click", (e) => {
    const date = document.querySelector("#dateInput").value.trim();
    const title = document.querySelector("#textarea-title").value.trim();
    const content = document.querySelector("#textarea-content").value.trim();

    // 하나라도 입력이 덜 되어있으면
    if (!date || !title || !content) {
        e.preventDefault();
        console.log("입력 덜 됨");
        showToast("날짜, 제목, 내용을 모두 입력해주세요.");
        e.preventDefault(); // form 제출 방지
        return;
    }
    // 입력을 다 하고 누르면
    console.log("통과");
    });
});