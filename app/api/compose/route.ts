import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      userCategory,
      titleHint,
      headcount,
      campaignType,
      selectedContentKeys,
      selectedSceneKeys,
      hashtags,
      externalLink,
    } = body

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock AI-generated content
    const marketingBrief = `${userCategory} 카테고리의 ${titleHint || "캠페인"}을 위한 마케팅 전략입니다. 
    
타겟 고객층은 20-30대 ${userCategory}에 관심이 많은 소비자들이며, ${campaignType === "reels" ? "릴스" : campaignType === "feed" ? "피드" : "스토리"} 형식으로 제작하여 최대한의 도달률을 확보하는 것이 목표입니다.

주요 메시지는 브랜드의 독특한 가치와 ${selectedContentKeys.length > 0 ? selectedContentKeys.join(", ") : "핵심 콘텐츠"}를 강조하며, 인플루언서의 진정성 있는 리뷰를 통해 신뢰도를 높이는 것입니다.`

    const contentInstructions = `콘텐츠 제작 시 다음 사항을 반드시 포함해주세요:

${selectedContentKeys.map((key, idx) => `${idx + 1}. ${key} - 자연스럽게 녹여내되 핵심 메시지가 명확히 전달되도록 해주세요.`).join("\n")}

전체적인 톤앤매너는 친근하고 솔직한 느낌으로, 과도한 광고성 표현은 지양하고 실제 사용 경험을 중심으로 구성해주세요. ${campaignType === "reels" ? "15-30초 내외의 짧고 임팩트 있는 영상" : campaignType === "feed" ? "시각적으로 매력적인 이미지와 상세한 설명" : "간결하고 빠르게 소비 가능한 스토리 형식"}으로 제작해주시기 바랍니다.`

    const sceneInstructions = `촬영 시 다음 장면들을 포함해주세요:

${selectedSceneKeys.map((key, idx) => `${idx + 1}. ${key} - 자연광을 활용하여 선명하고 깨끗한 화질로 촬영해주세요.`).join("\n")}

각 장면은 브랜드의 정체성과 제품/서비스의 특징이 잘 드러나도록 구성하되, 인플루언서의 개성과 스타일도 함께 표현될 수 있도록 해주세요. 전환 효과는 자연스럽게, 배경음악은 콘텐츠 분위기에 맞게 선택해주시기 바랍니다.`

    const titleSuggestion =
      titleHint ||
      `${userCategory} ${campaignType === "reels" ? "릴스" : campaignType === "feed" ? "피드" : "스토리"} 캠페인`

    const suggestedHashtags =
      hashtags.length > 0 ? hashtags : [`#${userCategory}`, `#${campaignType}`, "#인플루언서마케팅", "#협찬", "#체험단"]

    return NextResponse.json({
      success: true,
      data: {
        marketingBrief,
        contentInstructions,
        sceneInstructions,
        titleSuggestion,
        hashtags: suggestedHashtags,
      },
    })
  } catch (error) {
    console.error("Compose API error:", error)
    return NextResponse.json({ error: "Failed to generate campaign content" }, { status: 500 })
  }
}
