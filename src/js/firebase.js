import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBfSnlYUdcEqahuE0nuEPgZtyc05nxjtHE",
    authDomain: "filmoteka-582f6.firebaseapp.com",
    databaseURL: "https://filmoteka-582f6-default-rtdb.firebaseio.com",
    projectId: "filmoteka-582f6",
    storageBucket: "filmoteka-582f6.appspot.com",
    messagingSenderId: "218771303492",
    appId: "1:218771303492:web:8772c72c18d03702ab6011",
    measurementId: "G-239H878QXK"
  };


const app = initializeApp(firebaseConfig);
var auth = getAuth();
console.log(auth);
console.log('test')
const database = getDatabase(app);
console.log(app);

function registerModal() {
    email = document.getElementById("register_email").value;
    password = document.getElementById("register_password").value;

    if (validate_email(email) == false || validate_password(password) == false) {
        alert("Email or Password is Outta Line!!")
            return
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(function(userCredential) {
        const user = userCredential.user;
        const databaseRef = ref(database);
        const user_data = {
            email: email,
            last_login: Date.now()
        };

        set(ref(database, 'users/' + user.uid), user_data)
            .then(() => {
                alert('User Created! Please proceed to Login!');
            })
            .catch((error) => {
                alert('Error creating user data: ' + error.message);
            });
    })
    .catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });
}

function loginModal() {
    email = document.getElementById("login_email").value;
    password = document.getElementById("login_password").value;
    rememberMe = document.getElementById("remember_me").checked;


    if (validate_email(email) == false || validate_password(password) == false) {
        alert("Email or Password is Outta Line!!")
        return
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(function(userCredential) {
            auth = getAuth();
            const user = userCredential.user;
            const email = user.email;

            const signOutBtn = document.getElementsByClassName('btn-signOut');
            if (signOutBtn.length) {
                signOutBtn[0].classList.remove('inactive')
            }
            const loginBtn = document.getElementsByClassName('btn-logIn');
            if (loginBtn.length) {
                loginBtn[0].classList.add('inactive')
            }

            document.querySelector("[data-modal]").classList.toggle("is-hidden");
            alert("Welcome "+email);
        })
        .catch(function(error) {
            const error_message = error.message;
            alert(error_message);
        })
}

function signOutAction() {
    debugger
    signOut(auth).then(() => {
        const signOutBtn = document.getElementsByClassName('btn-signOut');
        if (signOutBtn.length) {
            signOutBtn[0].classList.add('inactive')
        }
        const loginBtn = document.getElementsByClassName('btn-logIn');
        if (loginBtn.length) {
            loginBtn[0].classList.remove('inactive')
        }
    }).catch((error) => {
        const error_message = error.message;
        alert(error_message);
    });
}


document.addEventListener("DOMContentLoaded", function() {
    const loginModalUs = document.querySelector(".submit-btn[onclick='loginModal()']");
    const registerModalUs = document.querySelector(".submit-btn[onclick='registerModal()']");
    const signOut = document.querySelector(".btn-signOut");
    if (signOut) {
        signOut.addEventListener("click", signOutAction)
    }

    if (loginModalUs) {
        loginModalUs.onclick = null;
        loginModalUs.addEventListener("click", loginModal);
    }
    if (registerModalUs) {
        registerModalUs.onclick = null;
        registerModalUs.addEventListener("click", registerModal);
    }

})

function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
        return true
    } else {
        return false
    }
}

function validate_password(password) {
    if (password > 6) {
        return false
    } else {
        return true
    }
}

function validate_field(field) {
    if (field == null) {
        return false
    }

    if (field.length <= 0) {
        return false
    } else {
        return true
    }
}

