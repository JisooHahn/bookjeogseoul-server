package com.app.bookJeog.domain.dto;


import com.app.bookJeog.domain.enumeration.MemberInquiryStatus;
import com.app.bookJeog.domain.enumeration.MemberInquiryType;
import com.app.bookJeog.domain.enumeration.PersonalMemberStatus;
import com.app.bookJeog.domain.vo.CommentMentionVO;
import com.app.bookJeog.domain.vo.MemberInquiryVO;
import lombok.*;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MemberInquiryDTO {
    @EqualsAndHashCode.Include
    private Long id;
    private Long memberId;
    private MemberInquiryType memberInquiryType;
    private String memberInquiryText;
    private String memberInquiryTitle;
    private String memberInquiryAnswer;
    private MemberInquiryStatus memberInquiryStatus;
    private String createdDate;
    private String updatedDate;

    @Builder
    public MemberInquiryVO toMemberInquiryVO() {
        return MemberInquiryVO.builder().
                id(id).
                memberId(memberId).
                memberInquiryTitle(memberInquiryTitle).
                memberInquiryAnswer(memberInquiryAnswer).
                memberInquiryStatus(memberInquiryStatus).
                memberInquiryText(memberInquiryText).
                memberInquiryType(memberInquiryType).
                createdDate(createdDate).
                updatedDate(updatedDate).
                build();
    }

}
