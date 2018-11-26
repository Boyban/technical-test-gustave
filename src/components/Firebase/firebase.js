import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';



const config = {
    apiKey: "AIzaSyDicWFbxwYJ_aCpXl0QSSOIPSf_9BcE5EQ",
    authDomain: "test-gustave.firebaseapp.com",
    databaseURL: "https://test-gustave.firebaseio.com",
    projectId: "test-gustave",
    storageBucket: "test-gustave.appspot.com",
    messagingSenderId: "465469593647",
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.database();

    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    cart = user => this.db.ref(`cart/${user}`);

    carts = () => this.db.ref('carts');
}

export default Firebase;