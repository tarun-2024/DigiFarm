import { markets, buyers, storageFacilities, transactions } from '@/lib/mock-data'

export const getMarketPrices = async () => {
  return markets.map(market => ({
    ...market,
    distance: Math.floor(Math.random() * 80 + 10),
    transport: Math.floor(Math.random() * 100 + 20),
    netRealization: market.price - Math.floor(Math.random() * 100 + 20)
  }))
}

export const getArrivalVolumes = async () => {
  return markets.map(market => ({
    market: market.name,
    volume: market.arrival,
    trend: market.trend
  }))
}

export const getPriceForecast = async (crop = 'Potato', days = 14) => {
  const currentPrice = 2650
  const dailyIncrease = Math.random() * 10 + 2
  
  const forecast = []
  for (let i = 0; i < days; i++) {
    forecast.push({
      day: i + 1,
      price: Math.round(currentPrice + (i + 1) * dailyIncrease + (Math.random() - 0.5) * 30),
      confidence: Math.round(90 - i * 1.5 + (Math.random() - 0.5) * 10)
    })
  }
  
  return {
    crop,
    currentPrice,
    forecast,
    overallConfidence: Math.round(78 + (Math.random() - 0.5) * 10)
  }
}

export const getSaleRecommendation = async (farmerData) => {
  const { liquidityPreference } = farmerData
  
  const currentPrice = 2650
  const forecast3Day = 2690
  const forecast7Day = 2720
  
  const scenarios = [
    {
      action: 'SELL NOW',
      price: currentPrice,
      transport: 60,
      storage: 0,
      spoilage: 0,
      net: currentPrice - 60,
      reason: 'Immediate payment and current market price is favorable'
    },
    {
      action: 'WAIT 3 DAYS',
      price: forecast3Day,
      transport: 60,
      storage: 120,
      spoilage: 40,
      net: forecast3Day - 60 - 120 - 40,
      reason: 'Small price increase expected but storage costs may reduce net return'
    },
    {
      action: 'WAIT 7 DAYS',
      price: forecast7Day,
      transport: 60,
      storage: 280,
      spoilage: 100,
      net: forecast7Day - 60 - 280 - 100,
      reason: 'Higher price but significant storage and spoilage risks'
    }
  ]
  
  if (liquidityPreference === 'immediate') {
    return { recommended: scenarios[0], alternatives: scenarios.slice(1), confidence: 82 }
  } else if (liquidityPreference === 'medium') {
    return { recommended: scenarios[1], alternatives: [scenarios[0], scenarios[2]], confidence: 75 }
  } else {
    return { recommended: scenarios[2], alternatives: scenarios.slice(0, 2), confidence: 70 }
  }
}

export const getBuyerMatches = async (crop, quantity) => {
  return buyers.map(buyer => ({
    ...buyer,
    matchScore: Math.round(85 + Math.random() * 14),
    qualityMatch: Math.round(80 + Math.random() * 18),
    priceMatch: Math.round(80 + Math.random() * 18),
    distanceMatch: Math.round(80 + Math.random() * 18),
    reliabilityMatch: Math.round(80 + Math.random() * 18)
  }))
}

export const getBuyerTrustScore = async (buyerId) => {
  return {
    id: buyerId,
    trustScore: 94,
    paymentReliability: 95,
    orderFulfillment: 93,
    completedTransactions: 148,
    disputeRate: 2,
    avgResponseTime: 2.4,
    verified: true,
    verificationDetails: { business: true, kyc: true, contact: true }
  }
}

export const getSupplierTrustScore = async (supplierId) => {
  return {
    id: supplierId,
    trustScore: 92,
    fulfillmentRate: 94,
    qualityConsistency: 90,
    disputeRate: 3,
    deliveryReliability: 91,
    completedTransactions: 76
  }
}

export const createLot = async (lotData) => {
  const lotId = `DF-${lotData.location?.state || 'WB'}-${lotData.crop?.slice(0, 3) || 'CRP'}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`
  return {
    id: lotId,
    ...lotData,
    createdAt: new Date().toISOString(),
    status: 'Active',
    qualityScore: Math.round(85 + Math.random() * 14)
  }
}

export const getLots = async (filters = {}) => {
  return [
    {
      id: 'DF-WB-POT-001245',
      farmer: 'Rajesh Kumar',
      crop: 'Potato',
      variety: 'Kufri Jyoti',
      quantity: '15 tonnes',
      grade: 'A',
      price: 2650,
      qualityScore: 91,
      location: 'Burdwan, West Bengal',
      harvestDate: '2026-01-10',
      status: 'Active',
      images: ['/images/potato-1.jpg']
    },
    {
      id: 'DF-WB-POT-001246',
      farmer: 'Suresh Singh',
      crop: 'Potato',
      variety: 'Kufri Chandramukhi',
      quantity: '10 tonnes',
      grade: 'A+',
      price: 2700,
      qualityScore: 94,
      location: 'Hooghly, West Bengal',
      harvestDate: '2026-01-12',
      status: 'Active',
      images: ['/images/potato-3.jpg']
    }
  ]
}

export const getMatchingLots = async (demandId) => {
  const lots = await getLots()
  return lots.map(lot => ({
    ...lot,
    matchScore: Math.round(85 + Math.random() * 14),
    distance: Math.floor(Math.random() * 80 + 10),
    supplierReliability: Math.round(80 + Math.random() * 18)
  }))
}

export const getOffers = async (userId, role) => {
  return [
    {
      id: 'OFF-001',
      buyer: 'ABC Foods',
      seller: 'Rajesh Kumar',
      crop: 'Potato',
      quantity: '5 tonnes',
      price: 2650,
      status: 'Pending',
      createdAt: '2026-01-15T10:30:00Z'
    },
    {
      id: 'OFF-002',
      buyer: 'FreshMart',
      seller: 'Suresh Singh',
      crop: 'Rice',
      quantity: '3 tonnes',
      price: 1800,
      status: 'Accepted',
      createdAt: '2026-01-14T14:20:00Z'
    }
  ]
}

export const createOffer = async (offerData) => {
  return {
    id: `OFF-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
    ...offerData,
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
}

export const acceptOffer = async (offerId) => {
  return { id: offerId, status: 'Accepted', acceptedAt: new Date().toISOString() }
}

export const counterOffer = async (offerId, counterData) => {
  return { id: offerId, ...counterData, status: 'Countered', counteredAt: new Date().toISOString() }
}

export const getLogistics = async (transactionId) => {
  return {
    id: transactionId,
    truck: 'WB-12-AB-1234',
    capacity: '20 tonnes',
    distance: '42 km',
    estimatedCost: 8200,
    eta: '2h 15m',
    status: 'In Transit',
    timeline: [
      { status: 'Pickup', completed: true, time: '2026-01-15T08:00:00Z' },
      { status: 'Transit', completed: true, time: '2026-01-15T09:30:00Z' },
      { status: 'Delivery', completed: false, time: null }
    ]
  }
}

export const getStorage = async (location, crop) => {
  return storageFacilities.map(facility => ({
    ...facility,
    distance: facility.distance + Math.floor(Math.random() * 5 - 2),
    availableCapacity: Math.floor(facility.capacity * (0.4 + Math.random() * 0.4)),
    priceGain: Math.floor(Math.random() * 200 + 50),
    recommendation: Math.random() > 0.5 ? 'STORE' : 'SELL NOW'
  }))
}

export const getTransactions = async (userId, role) => {
  return transactions
}

export const getTransaction = async (transactionId) => {
  return {
    id: transactionId,
    farmer: 'Rajesh Kumar',
    fpo: null,
    buyer: 'ABC Foods',
    crop: 'Potato',
    quantity: '5 tonnes',
    price: 2650,
    totalValue: 132500,
    quality: { score: 91, grade: 'A', parameters: { moisture: '72%', size: 'Medium', defects: '4%' } },
    logistics: { provider: 'AgriLogistics', truck: 'WB-12-AB-1234', status: 'In Transit' },
    payment: { status: 'Initiated', id: 'PAY-001245', amount: 132500 },
    timeline: [
      { status: 'Lot Created', completed: true, time: '2026-01-10T10:00:00Z' },
      { status: 'Offer Accepted', completed: true, time: '2026-01-11T14:30:00Z' },
      { status: 'Payment Initiated', completed: true, time: '2026-01-12T09:00:00Z' },
      { status: 'Pickup Completed', completed: true, time: '2026-01-15T08:00:00Z' },
      { status: 'In Transit', completed: true, time: '2026-01-15T09:30:00Z' },
      { status: 'Delivery', completed: false, time: null },
      { status: 'Settlement', completed: false, time: null }
    ],
    dispute: null
  }
}

export const getPaymentStatus = async (transactionId) => {
  return {
    transactionId,
    amount: 132500,
    status: 'Initiated',
    method: 'Bank Transfer',
    initiatedAt: '2026-01-12T09:00:00Z',
    estimatedSettlement: '2026-01-14T09:00:00Z',
    deliveryConfirmation: true
  }
}

export const createDispute = async (disputeData) => {
  return {
    id: `DSP-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
    ...disputeData,
    status: 'Under Review',
    createdAt: new Date().toISOString(),
    evidence: disputeData.evidence || []
  }
}

export const getNotifications = async (userId) => {
  return [
    {
      id: '1',
      type: 'offer',
      title: 'New Buyer Offer',
      message: 'ABC Foods has made an offer for your potato lot',
      read: false,
      createdAt: '2026-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'price',
      title: 'Price Alert',
      message: 'Potato prices have increased by 2% in Burdwan market',
      read: false,
      createdAt: '2026-01-15T08:15:00Z'
    },
    {
      id: '3',
      type: 'ai',
      title: 'AI Recommendation Update',
      message: 'New selling recommendation available for your potato crop',
      read: true,
      createdAt: '2026-01-14T16:00:00Z'
    }
  ]
}