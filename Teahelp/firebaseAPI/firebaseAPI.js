
import firebase from './../src/config';

const db = firebase.firestore();
import 'firebase/storage';

export async function createUser(firstName, lastName, password, email, gender, transtorn, birthday, PINParental, adreça, poblacio, codiPostal) {
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
            adreça,
            poblacio,
            codiPostal
        })
        docRefPictogrames = docRef.doc(res.user.uid).collection("Pictogrames")
        docRefPictogrames.doc("VULL ANAR AL COLE").set({
            accio: "VULL ANAR A CASA",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FAnar%20al%20cole.png?alt=media&token=85dc6a2c-b42a-421e-b518-a762497229ed"
        })
        docRefPictogrames.doc("VULL ANAR").set({
            accio: "VULL ANAR",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FAnar.png?alt=media&token=20fcdf48-098b-4774-86cd-6585264b9842"
        })
        docRefPictogrames.doc("VULL BEURE").set({
            accio: "VULL BEURE",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FBeure.png?alt=media&token=cbbf414d-8258-4463-9604-6feaa39e034b"
        })
        docRefPictogrames.doc("VULL ANAR AMB BUS").set({
            accio: "VULL ANAR AMB BUS",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FBus.png?alt=media&token=d17a78ab-7a50-473a-b604-71214f2cc124"
        })
        docRefPictogrames.doc("VULL ANAR A CASA").set({
            accio: "VULL ANAR A CASA",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FCasa.png?alt=media&token=e3b387c1-b2ae-4b25-b953-bbf733f15d82"
        })
        docRefPictogrames.doc("VULL DORMIR").set({
            accio: "VULL DORMIR",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FDormir.png?alt=media&token=24d0af29-cc30-4be6-9ce5-8e07f4ea1d71"
        })
        docRefPictogrames.doc("VULL ESCOLTAR").set({
            accio: "VULL ESCOLTAR",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FEscoltar.png?alt=media&token=27446d7c-f9fc-454f-84d2-f9e0468bc28b"
        })
        docRefPictogrames.doc("VULL JUGAR").set({
            accio: "VULL JUGAR",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FJugar.png?alt=media&token=4624f58d-655a-443d-968c-9955ca930937"
        })
        docRefPictogrames.doc("VULL MENJAR").set({
            accio: "VULL MENJAR",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FMenjar.png?alt=media&token=7d50921f-af7e-4ec8-a06e-774a680f5270"
        })
        docRefPictogrames.doc("NO").set({
            accio: "NO",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FNo.png?alt=media&token=4a0b0166-9c6c-41aa-b08e-368d85724e28"
        })
        docRefPictogrames.doc("VULL PARLAR").set({
            accio: "VULL PARLAR",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FParlar.png?alt=media&token=7abd6d18-44a5-457c-b9fb-fedc96ceda29"
        })
        docRefPictogrames.doc("VULL SALUDAR").set({
            accio: "VULL SALUDAR",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FSaludar.png?alt=media&token=abb1646c-dcc1-4344-b225-554b492001a3"
        })
        docRefPictogrames.doc("VULL SEURE").set({
            accio: "VULL SEURE",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FSeure.png?alt=media&token=ad83fb4d-127c-439b-9fc9-1d7a9ddc1602"
        })
        docRefPictogrames.doc("SI").set({
            accio: "SI",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FSi.png?alt=media&token=5680c890-31b9-4eea-92d0-8579d4b08a69"
        })
        docRefPictogrames.doc("VULL VEURE LA TELE").set({
            accio: "VULL VEURE LA TELE",
            url: "https://firebasestorage.googleapis.com/v0/b/teahelp-2c2af.appspot.com/o/Predeterminats%2FVeure%20la%20tele.png?alt=media&token=6ecf24b2-24cc-4fbe-b35f-ed5358fb79ed"
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
        let docRef2 = db.collection("Usuaris").doc(user_uid).collection("Preferencies")
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
export async function getLlistaPreferencies(user_uid) {
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
export async function crearPictograma(user_uid, accio, url) {
    let errorR
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Pictogrames").doc(accio)
    return docRef.get().then(async function (doc) {
        if (doc.exists) {
            errorR = "Ja tens un pictograma amb aquesta acció"
            return errorR
        }
        else await docRef.set({
            accio: accio,
            url: url
        }).then(function (docRef) {

        }).catch(function (error) {
            //console.error("Error writing document: ", error);
        });;
    }).catch(function (error) {
        //console.log("Error getting document:", error);
    });
}
export async function getLListaPictogrames(user_uid) {
    let resultat = []
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Pictogrames")

    await docRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            /*let url = await firebase.storage().ref(user_uid + '/pictogrames/' + doc.id).getDownloadURL();
            console.log("url dins dde firebase", url)*/
            resultat.push({ accio: doc.id, imatge: doc.data().url })
        });
    });
    return resultat
}
export async function esborrarPictograma(user_uid, accio) {
    let docRef = db.collection("Usuaris").doc(user_uid).collection("Pictogrames").doc(accio)
    let storageRef = firebase.storage().ref().child(user_uid + '/pictogrames/' + accio)

    return await docRef.delete().then(async function () {
        //console.log("Document successfully deleted!");
        await storageRef.delete().then(function () {
            // File deleted successfully
        }).catch(function (error) {
            // Uh-oh, an error occurred!
        });
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}