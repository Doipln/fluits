export const getAdvertiserProfileCompletion = (): number => {
  if (typeof window === "undefined") return 0

  const brandCategory = localStorage.getItem("advertiser_brand_category")
  const storeType = localStorage.getItem("advertiser_store_type")
  const brandName = localStorage.getItem("advertiser_brand_name")
  const brandLink = localStorage.getItem("advertiser_brand_link")
  const businessNum1 = localStorage.getItem("advertiser_business_num1")
  const businessNum2 = localStorage.getItem("advertiser_business_num2")
  const businessNum3 = localStorage.getItem("advertiser_business_num3")
  const offlineLocation = localStorage.getItem("advertiser_offline_location")
  const businessNumberStatus = localStorage.getItem("advertiser_business_number_status")

  console.log("[v0] Profile Completion Check:", {
    brandCategory,
    storeType,
    brandName,
    brandLink,
    businessNum1,
    businessNum2,
    businessNum3,
    offlineLocation,
    businessNumberStatus,
  })

  let completed = 0
  let total = 4 // Base required fields: category, storeType, brandName, businessNumber

  // Check brand category
  if (brandCategory && brandCategory.trim() !== "") completed++

  // Check store type
  if (storeType && storeType.trim() !== "") completed++

  // Check brand name
  if (brandName && brandName.trim() !== "") completed++

  if (
    businessNum1 &&
    businessNum1.length === 3 &&
    businessNum2 &&
    businessNum2.length === 2 &&
    businessNum3 &&
    businessNum3.length === 5 &&
    businessNumberStatus === "success"
  ) {
    completed++
  }

  // Check conditional required field (offline location)
  if (storeType === "offline" || storeType === "both") {
    total++ // Add offline location to total
    if (offlineLocation && offlineLocation.trim() !== "") {
      completed++
    }
  }

  // Check conditional required field (brand link for online/both)
  if (storeType === "online" || storeType === "both") {
    total++ // Add brand link to total
    if (brandLink && brandLink.trim() !== "") {
      completed++
    }
  }

  const percentage = Math.round((completed / total) * 100)

  console.log("[v0] Profile Completion:", `${completed}/${total} = ${percentage}%`)

  return percentage
}

export const checkAdvertiserProfileComplete = (): boolean => {
  return getAdvertiserProfileCompletion() === 100
}
