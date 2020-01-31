
import firebase from './../src/config';

const db = firebase.firestore();

export async function createUser(firstName, lastName, password, email, gender, transtorn, birthday, PINParental) {
    let docRef
    return await firebase.auth().createUserWithEmailAndPassword(email, password).then((res) => {
        docRef = db.collection("Usuaris")
        docRef.doc(res.user.uid).set({
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            birthday: birthday,
            transtorn: transtorn,
            PINParental: PINParental,
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
export async function getDadesUsuari(user_uid) {
    let docRef = db.collection("Usuaris").doc(user_uid)
    let resultat
    await docRef.get().then(function (doc) {
        if (doc.exists) {
            //console.log("Document data:", doc.data());
            resultat = doc.data()
        } else {
            // doc.data() will be undefined in this case
            //console.log("No such document!");
        }
    }).catch(function (error) {
        //console.log("Error getting document:", error);
    });
    return resultat
}
export async function canviarModeEdicio(user_uid, mode) {
    let docRef = db.collection("Usuaris").doc(user_uid)
    return await docRef.update({
        modeEdicio: !mode
    })
        .then(function () {
            //console.log("Document successfully updated!");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
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
        }).then(function (docRef) {

        }).catch(function (error) {
            //console.error("Error writing document: ", error);
        });;
    }).catch(function (error) {
        //console.log("Error getting document:", error);
    });
}
export async function getLlistaContactes(user_uid) {
    let resultat = []
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Contactes")
    await docRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            resultat.push({ numero: doc.id, nom: doc.data().name })
        });
    });
    return resultat
}
export async function esborrarContacte(user_uid, numero) {
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Contactes").doc(numero)
    return await docRef.delete().then(function () {
        //console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}
export async function creaDireccio(user_uid, nomDireccio, direccio) {
    let errorR
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Direccions").doc(nomDireccio)
    return docRef.get().then(async function (doc) {
        if (doc.exists) {
            errorR = "Ja tens una direcció amb aquest nom"
            return errorR
        }
        else await docRef.set({
            direccio: direccio,
        }).then(function (docRef) {

        }).catch(function (error) {
            //console.error("Error writing document: ", error);
        });;
    }).catch(function (error) {
        //console.log("Error getting document:", error);
    });
}
export async function getLlistaDireccions(user_uid) {
    let resultat = []
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Direccions")
    await docRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            resultat.push({ nom: doc.id, direccio: doc.data().direccio })
        });
    });
    return resultat
}
export async function esborrarDireccio(user_uid, nomDireccio) {
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Direccions").doc(nomDireccio)
    return await docRef.delete().then(function () {
        //console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}
export async function crearPreferencies(user_uid, numContacte1, nomContacte1, numContacte2, nomContacte2, numContacte3, nomContacte3) {
    let docRef1 = db.collection("Usuaris").doc(user_uid).collection("Preferencies").doc("1")
    await docRef1.set({
        numero: numContacte1,
        nom: nomContacte1
    }).then(async function (docRef) {
        let docRef2 = db.collection("Usuaris").doc(user_uid).collection("Preferencies").doc("2")
        await docRef2.set({
            numero: numContacte2,
            nom: nomContacte2
        }).then(async function (docRef) {
            let docRef3 = db.collection("Usuaris").doc(user_uid).collection("Preferencies").doc("3")
            await docRef3.set({
                numero: numContacte3,
                nom: nomContacte3
            }).then(function (docRef) {

            }).catch(function (error) {
                //console.error("Error writing document: ", error);
            });;
        }).catch(function (error) {
            //console.error("Error writing document: ", error);
        });;
    }).catch(function (error) {
        //console.error("Error writing document: ", error);
    });;
}
export async function getLlistaPreferencies(user_uid){
    let resultat = []
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Preferencies")
    await docRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            resultat.push({ numPreferencia: doc.id, numContacte: doc.data().numero, nomContacte: doc.data().nom })
        });
    });
    return resultat
}