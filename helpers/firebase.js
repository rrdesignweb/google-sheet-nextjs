import firebase from "firebase/app";
import "firebase/firestore";

const NEXT_FIREBASE_PROJECT_ID = "rubbish-collection-app";

const config = {
  projectId: NEXT_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_FIREBASE_MEASUREMENT_ID,
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
}

export const convertRubbishCollectionSnapshotToMap = (rubbish) => {
  const transformedCollection = rubbish.docs.map((doc) => {
    const { Brand, Category, Subcategory } = doc.data();
    return {
      Brand,
      Category,
      Subcategory,
    };
  });

  return transformedCollection;
};

export const firestore = firebase.firestore();
