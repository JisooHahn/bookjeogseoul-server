package com.app.bookJeog.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/post/*")
public class PostController {
    // 토론게시판 이동
    @GetMapping("discussion")
    public String goToDiscussion() {
        return "discussion/main";
    }


    // 토론 게시글
    @GetMapping("discussion/post")
    public String goToDiscussionPost() {
        return "discussion/post";
    }


    // 독후감 게시판
    @GetMapping("bookpost")
    public String goToBookPost() {
        return "post/post-list";
    }


    // 독후감 게시글
    @GetMapping("bookpost/post")
    public String goToBookPostPost() {
        return "post/post-detail";
    }


    // 독후감 작성
    @GetMapping("bookpost/write")
    public String goToBookPostWrite() {
        return "post/post-write";
    }



    // 독후감 수정
    @GetMapping("bookpost/edit")
    public String goToBookPostEdit() {
        return "post/post-update";
    }

    // 후원 인증 게시판
    @GetMapping("donate")
    public String goToDonateCert(){
        return "donation/donate_cert_main";
    }
    
    // 후원 인증 게시글    
    @GetMapping("donate/post")
    public String goTODonateCertPost(){
        return "donation/donate_cert_post";
    }

    // 후원 인증 게시글 작성
    @GetMapping("donate/write")
    public String goToDonateCertWrite(){
        return "donation/donate_cert_write";
    }
    
    // 후원 대상 게시판
    @GetMapping("receiver")
    public String goToReceiver(){
        return "donation/receiver_main";
    }

    // 후원 대상 게시글
    @GetMapping("receiver/post")
    public String goToReceiverPost(){
        return "donation/receiver_post";
    }

    // 후원 대상 게시글 작성
    @GetMapping("receiver/write")
    public String goToReceiverWrite(){
        return "donation/receiver_write";
    }

    // 이 주의 기부도서
    @GetMapping("weekly")
    public String goToWeekly(){
        return "donation/weekly_book";
    }

}
