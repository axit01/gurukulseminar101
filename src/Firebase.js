import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, getDocs } from 'firebase/firestore'

// Firebase configuration using Vite env vars. Set these in your .env file.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function saveRegistration(data) {
  const docRef = await addDoc(collection(db, 'registrations'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export { app, db }

// Subscribe to registration count in realtime. Callback receives an integer count.
export function subscribeRegistrationCount(callback) {
  try {
    const q = collection(db, 'registrations')
    const unsubscribe = onSnapshot(q, (snap) => {
      callback(snap.size)
    }, (err) => {
      console.error('registrations snapshot error', err)
      callback(0)
    })
    return unsubscribe
  } catch (err) {
    console.error('subscribeRegistrationCount error', err)
    return () => {}
  }
}

// One-off fetch of registration count (non-realtime). Useful for initial load if needed.
export async function fetchRegistrationCount() {
  try {
    const snap = await getDocs(collection(db, 'registrations'))
    return snap.size
  } catch (err) {
    console.error('fetchRegistrationCount error', err)
    return 0
  }
}