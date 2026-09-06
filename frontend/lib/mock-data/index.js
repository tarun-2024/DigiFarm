export const crops = [
  'Potato', 'Rice', 'Tomato', 'Onion', 'Wheat', 'Maize'
]

export const locations = [
  { state: 'West Bengal', districts: ['Burdwan', 'Howrah', 'Hooghly', 'Nadia', 'Murshidabad'] },
  { state: 'Bihar', districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'] },
  { state: 'Odisha', districts: ['Bhubaneswar', 'Cuttack', 'Sambalpur', 'Puri'] },
  { state: 'Jharkhand', districts: ['Ranchi', 'Jamshedpur', 'Bokaro', 'Dhanbad'] },
  { state: 'Uttar Pradesh', districts: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra'] }
]

export const markets = [
  { name: 'Burdwan Mandi', location: 'Burdwan, West Bengal', price: 2650, arrival: 1240, trend: 'up' },
  { name: 'Howrah Market', location: 'Howrah, West Bengal', price: 2580, arrival: 980, trend: 'down' },
  { name: 'Hooghly Mandi', location: 'Hooghly, West Bengal', price: 2600, arrival: 1100, trend: 'up' },
  { name: 'Nadia Market', location: 'Nadia, West Bengal', price: 2550, arrival: 850, trend: 'stable' },
  { name: 'Patna Mandi', location: 'Patna, Bihar', price: 2450, arrival: 1500, trend: 'down' }
]

export const buyers = [
  {
    id: '1',
    name: 'ABC Foods Pvt. Ltd.',
    verified: true,
    demand: 20,
    grade: 'A',
    priceRange: '₹2,600–₹2,750',
    distance: 42,
    trustScore: 94,
    match: 96,
    location: 'Kolkata, West Bengal'
  },
  {
    id: '2',
    name: 'FreshMart Retail',
    verified: true,
    demand: 15,
    grade: 'A',
    priceRange: '₹2,550–₹2,650',
    distance: 28,
    trustScore: 97,
    match: 91,
    location: 'Howrah, West Bengal'
  },
  {
    id: '3',
    name: 'AgroTrade International',
    verified: false,
    demand: 30,
    grade: 'A+',
    priceRange: '₹2,650–₹2,800',
    distance: 65,
    trustScore: 90,
    match: 88,
    location: 'Kolkata, West Bengal'
  }
]

export const storageFacilities = [
  {
    name: 'Burdwan Cold Storage',
    distance: 5,
    capacity: 500,
    cost: 40,
    suitability: ['Potato', 'Tomato', 'Onion'],
    rating: 4.5
  },
  {
    name: 'AgriWarehouse Solutions',
    distance: 12,
    capacity: 1000,
    cost: 35,
    suitability: ['Rice', 'Wheat', 'Maize'],
    rating: 4.2
  },
  {
    name: 'Farmers Storage Co-op',
    distance: 8,
    capacity: 300,
    cost: 30,
    suitability: ['Potato', 'Onion'],
    rating: 4.0
  }
]

export const transactions = [
  {
    id: 'DF-2026-001245',
    farmer: 'Rajesh Kumar',
    buyer: 'ABC Foods',
    crop: 'Potato',
    quantity: '5 tonnes',
    price: '₹2,650/quintal',
    date: '2026-01-15',
    status: 'In Transit',
    paymentStatus: 'Initiated'
  },
  {
    id: 'DF-2026-001246',
    farmer: 'Suresh Singh',
    buyer: 'FreshMart',
    crop: 'Rice',
    quantity: '3 tonnes',
    price: '₹1,800/quintal',
    date: '2026-01-14',
    status: 'Delivered',
    paymentStatus: 'Completed'
  }
]

export const getRandomPrice = (base, range) => {
  return base + (Math.random() * range * 2 - range)
}

export const getRandomArrival = (base, range) => {
  return Math.round(base + (Math.random() * range * 2 - range))
}

export const generatePriceHistory = (basePrice, days, volatility = 50) => {
  const data = []
  let price = basePrice
  
  for (let i = 0; i < days; i++) {
    price += getRandomPrice(0, volatility)
    price = Math.max(price, 1000)
    data.push({
      date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      price: Math.round(price)
    })
  }
  
  return data
}