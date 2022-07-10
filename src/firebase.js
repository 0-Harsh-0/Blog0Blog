// for Deploying use this command----npm install - g firebase - tools
import {initializeApp} from "firebase/app";
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
} from "firebase/auth";
import {
    getFirestore,
} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import { toast } from "react-toastify";


// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBk1Rm_E_n1Tecahcrvl_P9R813rqjvIcc",
    authDomain: "blog0blog.firebaseapp.com",
    projectId: "blog0blog",
    storageBucket: "blog0blog.appspot.com",
    messagingSenderId: "42027040818",
    appId: "1:42027040818:web:f32ed38d0cf7ca352b3c2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const SignInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        return res
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const facebookProvider = new FacebookAuthProvider();
const SignInWithFacebook = async () => {
    try {
        const res = await signInWithPopup(auth, facebookProvider);
        return res
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const twitterProvider = new TwitterAuthProvider();
const SignInWithTwitter = async () => {
    try {
        const res = await signInWithPopup(auth, twitterProvider);
        return res
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const SignInWithEmailAndPassword = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res
    } catch (err) {
        toast.error(err.message);
        return false
    }
};

const SignUpWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await updateProfile(user,{displayName:name});
        return res
    } catch (err) {
       toast.error(err.message)
       return false
    }
};
const SendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};
const logout = () => {
    signOut(auth);
};



const storage = getStorage(app)
export {
    auth,
    db,
    SignInWithGoogle,
    SignInWithFacebook,
    SignInWithTwitter,
    SignInWithEmailAndPassword,
    SignUpWithEmailAndPassword,
    SendPasswordReset,
    logout,
    storage
};