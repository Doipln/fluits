import { type NextRequest, NextResponse } from "next/server"

const standardContentOptions = [
  { key: "new_seasonal", label: "신메뉴/시즌메뉴", hint: "새로 출시되거나 한정 판매 중인 음료·디저트 소개" },
  { key: "signature", label: "대표/시그니처메뉴", hint: "가장 인기 있거나 브랜드를 대표하는 메뉴 강조" },
  { key: "space_atmosphere", label: "공간/분위기", hint: "매장 인테리어, 조명, 감성적인 무드 전달" },
  { key: "making_behind", label: "제조과정/비하인드", hint: "음료 제조, 베이킹, 디저트 제작 과정 노출" },
  { key: "review_experience", label: "후기/체험리뷰", hint: "손님 반응, 인플루언서 후기, 체험단 리뷰 중심" },
  { key: "event_promotion", label: "이벤트/프로모션", hint: "할인·쿠폰·콜라보·시즌 이벤트 소개" },
  { key: "story_opening", label: "스토리/오픈소식", hint: "카페 철학, 오픈·리뉴얼 소식, 사장님 이야기" },
]

const cafeContentOptions = [
  { key: "signature_menu", label: "시그니처 메뉴 소개", hint: "가장 인기 있는 대표 메뉴를 소개합니다" },
  { key: "space_atmosphere", label: "공간 / 분위기 중심", hint: "매장의 인테리어와 감성적인 분위기를 전달합니다" },
  { key: "visit_vlog", label: "방문 후기 / 브이로그형", hint: "방문 경험을 브이로그 형식으로 담습니다" },
  { key: "service_cleanliness", label: "서비스 / 청결 리뷰", hint: "서비스 품질과 매장 청결도를 리뷰합니다" },
  { key: "photo_zone", label: "포토존 / 인스타 포인트", hint: "인스타그램에 올리기 좋은 포토존을 소개합니다" },
  { key: "new_event", label: "신메뉴 / 이벤트", hint: "새로운 메뉴나 진행 중인 이벤트를 알립니다" },
]

const cafeSceneOptions = [
  { key: "store_exterior", label: "매장 외관", hint: "카페 입구와 외부 전경을 촬영합니다" },
  { key: "interior_atmosphere", label: "인테리어 / 분위기", hint: "매장 내부의 인테리어와 분위기를 담습니다" },
  {
    key: "signature_dessert",
    label: "시그니처 메뉴 / 디저트 컷",
    hint: "대표 메뉴와 디저트를 클로즈업으로 촬영합니다",
  },
  { key: "order_process", label: "메뉴 주문 / 준비 과정", hint: "주문하고 메뉴가 준비되는 과정을 보여줍니다" },
  { key: "tasting_experience", label: "시음 / 체험 장면", hint: "실제로 맛보고 체험하는 모습을 담습니다" },
]

const restaurantContentOptions = [
  { key: "signature_menu", label: "대표메뉴소개", hint: "가장 인기 있는 대표 메뉴를 소개합니다" },
  { key: "store_atmosphere", label: "매장분위기", hint: "매장의 전체적인 분위기를 전달합니다" },
  { key: "visit_review", label: "방문후기", hint: "실제 방문 경험을 리뷰합니다" },
  { key: "taste_service", label: "맛·서비스", hint: "음식의 맛과 서비스 품질을 평가합니다" },
  { key: "menu_info", label: "메뉴정보", hint: "메뉴 구성과 가격 정보를 안내합니다" },
  { key: "new_menu", label: "신메뉴소식", hint: "새로 출시된 메뉴를 소개합니다" },
]

const restaurantSceneOptions = [
  { key: "store_exterior", label: "매장외관", hint: "음식점 입구와 외부 전경을 촬영합니다" },
  { key: "interior_view", label: "내부전경", hint: "매장 내부의 전체적인 모습을 담습니다" },
  { key: "cooking_scene", label: "조리장면", hint: "음식이 만들어지는 과정을 보여줍니다" },
  { key: "menu_closeup", label: "메뉴클로즈업", hint: "음식을 가까이서 상세하게 촬영합니다" },
  { key: "serving_setting", label: "서빙세팅", hint: "음식이 서빙되고 세팅되는 모습을 담습니다" },
  { key: "tasting_scene", label: "시식모습", hint: "실제로 음식을 맛보는 장면을 촬영합니다" },
]

const fashionContentOptions = [
  { key: "wearing_intro", label: "착용컷소개", hint: "옷을 입은 모습을 소개합니다" },
  { key: "product_detail", label: "제품디테일", hint: "제품의 세부 사항을 보여줍니다" },
  { key: "styling_tip", label: "스타일링팁", hint: "코디 방법과 스타일링 팁을 제공합니다" },
  { key: "brand_atmosphere", label: "브랜드분위기", hint: "브랜드의 전체적인 분위기를 전달합니다" },
  { key: "new_product", label: "신상품소식", hint: "새로 출시된 제품을 소개합니다" },
  { key: "event_promotion", label: "이벤트홍보", hint: "진행 중인 이벤트를 홍보합니다" },
]

const fashionSceneOptions = [
  { key: "product_view", label: "제품전경", hint: "제품의 전체적인 모습을 촬영합니다" },
  { key: "wearing_look", label: "착용모습", hint: "실제로 착용한 모습을 담습니다" },
  { key: "detail_cut", label: "디테일컷", hint: "제품의 디테일을 클로즈업으로 촬영합니다" },
  { key: "style_direction", label: "스타일연출", hint: "다양한 스타일링을 연출합니다" },
  { key: "outfit_change", label: "착장전환", hint: "여러 착장을 바꿔가며 보여줍니다" },
  { key: "daily_direction", label: "일상연출", hint: "일상 속에서 자연스럽게 연출합니다" },
]

const beautyContentOptions = [
  { key: "product_usage", label: "제품사용법", hint: "제품을 어떻게 사용하는지 보여줍니다" },
  { key: "product_effect", label: "제품효과", hint: "제품 사용 후 효과를 설명합니다" },
  { key: "texture_formulation", label: "제형·텍스처", hint: "제품의 질감과 제형을 소개합니다" },
  { key: "color_comparison", label: "발색·비교", hint: "색상 발색과 다른 제품과의 비교를 보여줍니다" },
  { key: "usage_review", label: "사용후기", hint: "실제 사용 경험을 리뷰합니다" },
  { key: "new_product", label: "신제품소식", hint: "새로 출시된 제품을 소개합니다" },
]

const beautySceneOptions = [
  { key: "product_package", label: "제품패키지", hint: "제품 패키지를 촬영합니다" },
  { key: "texture_cut", label: "제형·텍스처컷", hint: "제품의 질감을 클로즈업으로 촬영합니다" },
  { key: "usage_scene", label: "사용장면", hint: "제품을 사용하는 모습을 담습니다" },
  { key: "before_after", label: "전후비교", hint: "사용 전후를 비교하는 장면을 보여줍니다" },
  { key: "styling_cut", label: "연출컷", hint: "제품을 감성적으로 연출합니다" },
  { key: "face_closeup", label: "얼굴클로즈업", hint: "메이크업 결과를 가까이서 보여줍니다" },
]

const lifeServiceContentOptions = [
  { key: "service_intro", label: "서비스소개", hint: "제공하는 서비스를 소개합니다" },
  { key: "usage_method", label: "이용방법", hint: "서비스 이용 방법을 안내합니다" },
  { key: "before_after", label: "전후비교", hint: "서비스 전후를 비교하여 보여줍니다" },
  { key: "customer_review", label: "고객후기", hint: "실제 고객의 후기를 전달합니다" },
  { key: "space_styling", label: "공간연출", hint: "공간을 감성적으로 연출합니다" },
  { key: "event_news", label: "이벤트소식", hint: "진행 중인 이벤트를 알립니다" },
]

const lifeServiceSceneOptions = [
  { key: "service_view", label: "서비스전경", hint: "서비스 공간의 전체적인 모습을 촬영합니다" },
  { key: "usage_process", label: "이용과정", hint: "서비스를 이용하는 과정을 담습니다" },
  { key: "result_scene", label: "결장면", hint: "서비스 결과를 보여줍니다" },
  { key: "customer_interview", label: "고객인터뷰", hint: "고객의 인터뷰를 촬영합니다" },
  { key: "space_detail", label: "공간디테일", hint: "공간의 세부적인 부분을 담습니다" },
  { key: "review_cut", label: "사용후기컷", hint: "사용 후기를 촬영합니다" },
]

const travelSceneOptions = [
  { key: "exterior_view", label: "외관전경", hint: "숙소 외관을 촬영합니다" },
  { key: "room_view", label: "객실전경", hint: "객실 내부의 전체적인 모습을 담습니다" },
  { key: "facility_usage", label: "시설이용", hint: "시설을 이용하는 모습을 보여줍니다" },
  { key: "surrounding_scenery", label: "주변풍경", hint: "주변의 아름다운 풍경을 촬영합니다" },
  { key: "experience_scene", label: "체험장면", hint: "다양한 체험 활동을 담습니다" },
  { key: "relaxation_moment", label: "휴식모습", hint: "편안하게 휴식하는 모습을 보여줍니다" },
]

const eventContentOptions = [
  { key: "event_intro", label: "행사소개", hint: "행사의 전체적인 내용을 소개합니다" },
  { key: "venue_atmosphere", label: "현장분위기", hint: "행사장의 생생한 분위기를 전달합니다" },
  { key: "experience_review", label: "체험후기", hint: "실제 체험한 경험을 리뷰합니다" },
  { key: "program_intro", label: "프로그램소개", hint: "진행되는 프로그램을 소개합니다" },
  { key: "participation_guide", label: "참여안내", hint: "참여 방법을 안내합니다" },
  { key: "event_news", label: "이벤트소식", hint: "진행 중인 이벤트를 알립니다" },
]

const eventSceneOptions = [
  { key: "event_view", label: "행사전경", hint: "행사장의 전체적인 모습을 촬영합니다" },
  { key: "crowd_scene", label: "현장인파", hint: "많은 사람들이 모인 모습을 담습니다" },
  { key: "stage_performance", label: "무대공연", hint: "무대에서 진행되는 공연을 촬영합니다" },
  { key: "experience_scene", label: "체험장면", hint: "다양한 체험 활동을 담습니다" },
  { key: "photo_zone_cut", label: "포토존컷", hint: "포토존에서 촬영한 장면을 보여줍니다" },
  { key: "interview_cut", label: "인터뷰컷", hint: "참가자 인터뷰를 촬영합니다" },
]

const kidsContentOptions = [
  { key: "product_intro", label: "제품소개", hint: "제품의 특징을 소개합니다" },
  { key: "usage_scene", label: "사용모습", hint: "실제 사용하는 모습을 보여줍니다" },
  { key: "function_effect", label: "기능·효과", hint: "제품의 기능과 효과를 설명합니다" },
  { key: "parent_review", label: "부모후기", hint: "부모의 실제 사용 후기를 전달합니다" },
  { key: "safety_emphasis", label: "안전성강조", hint: "제품의 안전성을 강조합니다" },
  { key: "new_product", label: "신제품소식", hint: "새로 출시된 제품을 소개합니다" },
]

const kidsSceneOptions = [
  { key: "product_view", label: "제품전경", hint: "제품의 전체적인 모습을 촬영합니다" },
  { key: "usage_scene", label: "사용장면", hint: "제품을 사용하는 모습을 담습니다" },
  { key: "child_reaction", label: "아이리액션", hint: "아이의 반응을 촬영합니다" },
  { key: "parent_interview", label: "부모인터뷰", hint: "부모의 인터뷰를 담습니다" },
  { key: "daily_direction", label: "생활연출", hint: "일상 속에서 자연스럽게 연출합니다" },
  { key: "detail_cut", label: "디테일컷", hint: "제품의 디테일을 클로즈업으로 촬영합니다" },
]

const petContentOptions = [
  { key: "product_intro", label: "제품소개", hint: "제품의 특징을 소개합니다" },
  { key: "usage_scene", label: "사용모습", hint: "실제 사용하는 모습을 보여줍니다" },
  { key: "function_effect", label: "기능·효과", hint: "제품의 기능과 효과를 설명합니다" },
  { key: "reaction_review", label: "반응후기", hint: "반려동물의 반응과 후기를 전달합니다" },
  { key: "care_info", label: "관리정보", hint: "제품 관리 방법을 안내합니다" },
  { key: "new_product", label: "신제품소식", hint: "새로 출시된 제품을 소개합니다" },
]

const petSceneOptions = [
  { key: "product_view", label: "제품전경", hint: "제품의 전체적인 모습을 촬영합니다" },
  { key: "usage_scene", label: "사용장면", hint: "제품을 사용하는 모습을 담습니다" },
  { key: "reaction_moment", label: "반응모습", hint: "반려동물의 반응을 촬영합니다" },
  { key: "guardian_review", label: "보호자후기", hint: "보호자의 후기를 담습니다" },
  { key: "daily_direction", label: "생활연출", hint: "일상 속에서 자연스럽게 연출합니다" },
  { key: "detail_cut", label: "디테일컷", hint: "제품의 디테일을 클로즈업으로 촬영합니다" },
]

const optionsData: Record<
  string,
  {
    reels: {
      content: Array<{ key: string; label: string; hint: string }>
      scenes: Array<{ key: string; label: string; hint: string }>
    }
    feed: {
      content: Array<{ key: string; label: string; hint: string }>
      scenes: Array<{ key: string; label: string; hint: string }>
    }
    story: {
      content: Array<{ key: string; label: string; hint: string }>
      scenes: Array<{ key: string; label: string; hint: string }>
    }
  }
> = {
  카페: {
    reels: {
      content: cafeContentOptions,
      scenes: cafeSceneOptions,
    },
    feed: {
      content: cafeContentOptions,
      scenes: cafeSceneOptions,
    },
    story: {
      content: cafeContentOptions,
      scenes: cafeSceneOptions,
    },
  },
  음식점: {
    reels: {
      content: restaurantContentOptions,
      scenes: restaurantSceneOptions,
    },
    feed: {
      content: restaurantContentOptions,
      scenes: restaurantSceneOptions,
    },
    story: {
      content: restaurantContentOptions,
      scenes: restaurantSceneOptions,
    },
  },
  "패션/의류": {
    reels: {
      content: standardContentOptions,
      scenes: [
        { key: "application", label: "제품 바르기", hint: "제품을 사용하는 과정을 담습니다" },
        { key: "texture_show", label: "텍스처 보여주기", hint: "제품의 질감을 클로즈업합니다" },
        { key: "face_closeup", label: "얼굴 클로즈업", hint: "메이크업 결과를 가까이서 보여줍니다" },
        { key: "swatch", label: "스와치", hint: "색상을 손등에 발라 보여줍니다" },
      ],
    },
    feed: {
      content: standardContentOptions,
      scenes: [
        { key: "final_look", label: "완성 룩", hint: "최종 메이크업 결과를 촬영합니다" },
        { key: "product_shot", label: "제품 사진", hint: "제품을 예쁘게 배치해 촬영합니다" },
        { key: "detail_shot", label: "디테일 샷", hint: "특정 부위를 강조해 촬영합니다" },
      ],
    },
    story: {
      content: standardContentOptions,
      scenes: [
        { key: "morning_routine", label: "아침 루틴", hint: "아침 메이크업 과정" },
        { key: "quick_touch", label: "간단 터치업", hint: "빠른 화장 고침" },
        { key: "product_try", label: "제품 사용", hint: "제품을 처음 써보는 모습" },
      ],
    },
  },
  "뷰티/코스메틱": {
    reels: {
      content: standardContentOptions,
      scenes: [
        { key: "application", label: "제품 바르기", hint: "제품을 사용하는 과정을 담습니다" },
        { key: "texture_show", label: "텍스처 보여주기", hint: "제품의 질감을 클로즈업합니다" },
        { key: "face_closeup", label: "얼굴 클로즈업", hint: "메이크업 결과를 가까이서 보여줍니다" },
        { key: "swatch", label: "스와치", hint: "색상을 손등에 발라 보여줍니다" },
      ],
    },
    feed: {
      content: standardContentOptions,
      scenes: [
        { key: "final_look", label: "완성 룩", hint: "최종 메이크업 결과를 촬영합니다" },
        { key: "product_shot", label: "제품 사진", hint: "제품을 예쁘게 배치해 촬영합니다" },
        { key: "detail_shot", label: "디테일 샷", hint: "특정 부위를 강조해 촬영합니다" },
      ],
    },
    story: {
      content: standardContentOptions,
      scenes: [
        { key: "morning_routine", label: "아침 루틴", hint: "아침 메이크업 과정" },
        { key: "quick_touch", label: "간단 터치업", hint: "빠른 화장 고침" },
        { key: "product_try", label: "제품 사용", hint: "제품을 처음 써보는 모습" },
      ],
    },
  },
  "라이프/서비스": {
    reels: {
      content: lifeServiceContentOptions,
      scenes: lifeServiceSceneOptions,
    },
    feed: {
      content: lifeServiceContentOptions,
      scenes: lifeServiceSceneOptions,
    },
    story: {
      content: lifeServiceContentOptions,
      scenes: lifeServiceSceneOptions,
    },
  },
  "여행/숙박": {
    reels: {
      content: standardContentOptions,
      scenes: travelSceneOptions,
    },
    feed: {
      content: standardContentOptions,
      scenes: travelSceneOptions,
    },
    story: {
      content: standardContentOptions,
      scenes: travelSceneOptions,
    },
  },
  "이벤트/축제": {
    reels: {
      content: eventContentOptions,
      scenes: eventSceneOptions,
    },
    feed: {
      content: eventContentOptions,
      scenes: eventSceneOptions,
    },
    story: {
      content: eventContentOptions,
      scenes: eventSceneOptions,
    },
  },
  "키즈/유아": {
    reels: {
      content: kidsContentOptions,
      scenes: kidsSceneOptions,
    },
    feed: {
      content: kidsContentOptions,
      scenes: kidsSceneOptions,
    },
    story: {
      content: kidsContentOptions,
      scenes: kidsSceneOptions,
    },
  },
  "펫/반려동물": {
    reels: {
      content: petContentOptions,
      scenes: petSceneOptions,
    },
    feed: {
      content: petContentOptions,
      scenes: petSceneOptions,
    },
    story: {
      content: petContentOptions,
      scenes: petSceneOptions,
    },
  },
  "뷰티/화장품": {
    reels: {
      content: beautyContentOptions,
      scenes: beautySceneOptions,
    },
    feed: {
      content: beautyContentOptions,
      scenes: beautySceneOptions,
    },
    story: {
      content: beautyContentOptions,
      scenes: beautySceneOptions,
    },
  },
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category")

  if (!category) {
    return NextResponse.json({ error: "Category parameter is required" }, { status: 400 })
  }

  const options = optionsData[category] || optionsData["카페"]

  return NextResponse.json(options)
}
