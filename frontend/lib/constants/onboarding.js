// lib/constants/onboarding.js

export const STATES = [
  'West Bengal', 'Bihar', 'Odisha', 'Jharkhand', 'Uttar Pradesh',
  'Maharashtra', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan'
]

export const DISTRICTS_BY_STATE = {
  'West Bengal': ['Nadia', 'North 24 Parganas', 'South 24 Parganas', 'Hooghly', 
                  'Bardhaman', 'Murshidabad', 'Malda', 'Bankura', 'Birbhum', 
                  'Howrah', 'Kolkata'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Sambalpur', 'Puri', 'Balasore'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Bokaro', 'Dhanbad', 'Hazaribagh'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Allahabad'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda'],
  'Haryana': ['Gurugram', 'Faridabad', 'Hisar', 'Karnal', 'Rohtak'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer']
}

export const CROPS = [
  'Potato', 'Rice', 'Wheat', 'Tomato', 'Onion', 'Maize',
  'Mustard', 'Brinjal', 'Cabbage', 'Cauliflower', 'Other'
]

export const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिन्दी' },
  { value: 'Bengali', label: 'বাংলা' }
]

export const IRRIGATION_OPTIONS = [
  'Available', 'Partially Available', 'Not Available'
]

export const FPO_OPTIONS = ['Yes', 'No', 'Not sure']

export const STORAGE_DURATIONS = [
  'Up to 3 days', '4–7 days', '7–15 days', 'More than 15 days'
]

export const PAYMENT_OPTIONS = [
  { value: 'immediate', label: 'Immediate Payment', description: 'I need money as soon as possible' },
  { value: 'medium', label: '3–5 Days', description: 'I can wait a few days for a better price' },
  { value: 'long', label: '7+ Days', description: 'I can wait if the expected return is higher' }
]

export const STORAGE_OPTIONS = ['Yes', 'No']

export const INITIAL_CROP = {
  crop: '',
  variety: '',
  quantity: '',
  harvestDate: '',
  expectedSellingDate: ''
}

export const INITIAL_FARMER_STATE = {
  name: '',
  mobile: '',
  state: '',
  district: '',
  village: '',
  language: 'English',
  
  farmSize: '',
  irrigation: '',
  fpoMember: '',
  fpoName: '',
  
  crops: [{ ...INITIAL_CROP }],
  
  paymentNeed: '',
  storageAvailable: '',
  storageDuration: '',
  minimumPrice: ''
}