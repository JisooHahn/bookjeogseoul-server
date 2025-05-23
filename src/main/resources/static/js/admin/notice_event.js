document.addEventListener(('click'),(e) => {
    if(e.target.classList.contains("notice-link")){
        noticeService.getAllNotice(noticeLayout.showNoticeList);
    }
})


//  서버와의 연동
const noticeSearchInput = document.querySelector("input.notice-search-input")
const noticePageWrap = document.querySelector(".notice-pagination")
const noticeWrapper = document.querySelector(".notice-management")
// 페이지버튼으로 이동
// 기존 필터링 유지 후, 페이지만
noticePageWrap.addEventListener('click',(e) =>{
   if(e.target.classList.contains("page-btn")){
       const noticeKeyword = noticeSearchInput.value;
       const param = {page:e.target.id, search : {keyword : noticeKeyword}};
       noticeService.getAllNotice(noticeLayout.showNoticeList, param)
   }
})

// 키워드 검색
// 기존 필터링 모두 초기화
noticeSearchInput.addEventListener("keyup",(e) =>{
    if(e.key === 'Enter'){
        const noticeKeyword = e.target.value;

        if(noticeKeyword){
            const param = {search : {keyword : noticeKeyword}}
            noticeService.getAllNotice(noticeLayout.showNoticeList, param)
        }
    }
})

noticeWrapper.addEventListener('click',(e) => {
    if(e.target.classList.contains("modal-detail-btn")){
        const noticeId = e.target.value
        noticeService.getNoticeDetail(noticeLayout.showNoticeDetail,noticeId)
    }
})

document.addEventListener('click',(e) =>{
    if(e.target.classList.contains("save-btn") && e.target.parentElement.classList.contains("notice-footer")){
        const noticeId = e.target.value;
        const noticeTitle = document.querySelector("#notice-title").value;
        const noticeText = document.querySelector("#notice-text").value;
        noticeService.updateNotice(noticeId,noticeTitle,noticeText);
    }
})

const addNoticeButton = document.querySelector(".notice-add-btn")
const confirmNoticeButton = document.querySelector(".notice-confirm-btn")
const addNoticeModal = document.querySelector(".notice-modal")
addNoticeButton.addEventListener("click", () =>{
    openModal(addNoticeModal)
})

confirmNoticeButton.addEventListener('click',() =>{
    const noticeTitle = document.querySelector("#new-notice-title").value;
    const noticeText = document.querySelector("#new-notice-text").value;


    const files = noticeFileInput.files;
    console.log(files)

    if (noticeTitle.trim() === "" || noticeText.trim() === "") {
        alert("제목과 내용을 입력하세요.");
        return;
    }
    if(files == null) {
        noticeService.addNotice(noticeTitle, noticeText)
        closeModal(addNoticeModal);
    }
    else{
        noticeService.addNotice(noticeTitle, noticeText, files)
        closeModal(addNoticeModal);
    }

})

const noticeFileInput = document.querySelector("input[name=noticeFile]")
noticeFileInput.addEventListener('change',(e) => {
    const files = e.target.files;
    const imageList = [];
    let index = 0;
    if(files.length > 4){
        e.preventDefault();
        alert("파일은 최대 4개까지 첨부할 수 있습니다.")
    }
    for(const file of files){
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = URL.createObjectURL(file);
            noticeLayout.showAddedFile(imageUrl, file, index)
            index += 1;
            imageList.push(imageUrl);
        }
        reader.readAsDataURL(file);
    }
    console.log(imageList)
    console.log(files)
})



