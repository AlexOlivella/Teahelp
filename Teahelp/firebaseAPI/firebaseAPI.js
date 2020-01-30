
import firebase from './../src/config';

const db = firebase.firestore();

export async function createUser(firstName, lastName, password, email, gender, transtorn, birthday) {
    let docRef
    return await firebase.auth().createUserWithEmailAndPassword(email, password).then((res) => {
        docRef = db.collection("Usuaris")
        docRef.doc(res.user.uid).set({
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            birthday: birthday,
            transtorn: transtorn
        })
        return { isError: false, error: "" };
    }).catch((error) => {
        //console.log('createUser error: ', error);
        return { isError: true, error: error };
    });
}

export async function signInUser(email, password) {
    let error;

    //console.log('signInUser has been called.')

    return await firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
            //console.log('signInUser error: ', error);
            return { isError: true, error: error };
        });
}

export const logoutUser = () => {
    //console.log('logoutUser has been called.')
    firebase.auth().signOut();
}
export async function creaContacte(user_uid, nom, numero) {
    let errorR
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Contactes").doc(numero)
    return docRef.get().then(async function (doc) {
        if (doc.exists) {
            errorR = "Ja tens un contacte amb aquest número de telèfon"
            return errorR
        }
        else await docRef.set({
            name: nom,
        }).then(function (docRef){

        }).catch(function (error) {
            //console.error("Error writing document: ", error);
        });;
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}
export async function getLlistaContactes(user_uid) {
    let resultat = []
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Contactes")
    await docRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            resultat.push({ numero: doc.id, nom: doc.data().name })
        });
    });
    return resultat
}