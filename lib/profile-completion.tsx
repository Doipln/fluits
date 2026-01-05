export const calculateInfluencerProfileCompletion = (): number => {
  let completion = 0

  // Get all profile data from localStorage
  const avatar = localStorage.getItem("user_avatar")
  const nickname = localStorage.getItem("influencer_nickname")
  const category = localStorage.getItem("influencer_category")
  const instagramId = localStorage.getItem("influencer_instagram_id")
  const isInstagramVerified = localStorage.getItem("influencer_is_instagram_verified") === "true"
  const bio = localStorage.getItem("influencer_bio")
  const activityRate = localStorage.getItem("influencer_activity_rate")
  const isActivityRatePrivate = localStorage.getItem("influencer_is_activity_rate_private") === "true"
  const broadRegion = localStorage.getItem("influencer_broad_region")
  const narrowRegion = localStorage.getItem("influencer_narrow_region")
  const hashtagsStr = localStorage.getItem("influencer_profile_hashtags")
  const portfolioFilesStr = localStorage.getItem("influencer_portfolio_files")

  let hashtags: string[] = []
  try {
    hashtags = hashtagsStr ? JSON.parse(hashtagsStr) : []
  } catch {
    hashtags = []
  }

  let portfolioFiles: any[] = []
  try {
    portfolioFiles = portfolioFilesStr ? JSON.parse(portfolioFilesStr) : []
  } catch {
    portfolioFiles = []
  }
  // </CHANGE>

  // Total 9 fields
  const totalFields = 9

  // 1. Profile photo
  if (avatar && avatar !== "" && avatar !== "null") {
    completion += 1
  }

  // 2. Nickname
  if (nickname && nickname.trim() !== "") {
    completion += 1
  }

  // 3. Category
  if (category && category.trim() !== "") {
    completion += 1
  }

  // 4. Instagram ID (verified)
  if (instagramId && instagramId.trim() !== "" && isInstagramVerified) {
    completion += 1
  }

  // 5. Bio
  if (bio && bio.trim() !== "") {
    completion += 1
  }

  // 6. Activity rate (either filled or set to private)
  if ((activityRate && activityRate.trim() !== "") || isActivityRatePrivate) {
    completion += 1
  }

  // 7. Activity region
  if (broadRegion && broadRegion.trim() !== "") {
    if (broadRegion === "전체") {
      completion += 1
    } else if (narrowRegion && narrowRegion.trim() !== "") {
      completion += 1
    }
  }

  // 8. Hashtags
  if (hashtags.length > 0) {
    completion += 1
  }

  // 9. Portfolio
  if (portfolioFiles.length > 0) {
    completion += 1
  }
  // </CHANGE>

  // Calculate percentage
  const percentage = Math.round((completion / totalFields) * 100)

  console.log("[v0] Profile Completion:", {
    avatar: !!avatar,
    nickname: !!nickname,
    category: !!category,
    instagramVerified: isInstagramVerified,
    bio: !!bio,
    activityRate: !!(activityRate || isActivityRatePrivate),
    region: !!(broadRegion && (broadRegion === "전체" || narrowRegion)),
    hashtags: hashtags.length > 0,
    portfolio: portfolioFiles.length > 0,
    // </CHANGE>
    completion: `${completion}/${totalFields}`,
    percentage: `${percentage}%`,
  })

  return percentage
}
