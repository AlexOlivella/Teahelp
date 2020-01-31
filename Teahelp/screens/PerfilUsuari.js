import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import firebase from 'firebase'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import DialogInput from 'react-native-dialog-input';
import Dialog from "react-native-dialog";


export default class PerfilUsuari extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: "",
            cognom: "",
            dataNaixement: "",
            transtorn: "",
            genere: "",
            currentUser: "",
            gettingData: true,
            adreça: "",
            poblacio: "",
            codiPostal: "",
            isDialogVisible: false,
            PinParental: "",
            pinIntroduit: "",
            modeEdicio: "",
        }
    }

    static navigationOptions = {
        headerShown: false
    }
    obrirDrawer = () => {
        this.props.navigation.openDrawer();
    }
    componentDidMount() {
        this.getDadesUsuari()
    }
    async getDadesUsuari() {
        var user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getDadesUsuari(user.uid)
        //console.log(resultat.firstName)
        this.setState({
            nom: resultat.firstName,
            cognom: resultat.lastName,
            genere: resultat.gender,
            transtorn: resultat.transtorn,
            dataNaixement: resultat.birthday,
            adreça: resultat.adreça,
            poblacio: resultat.poblacio,
            codiPostal: resultat.codiPostal,
            currentUser: user,
            PinParental: resultat.PINParental,
            modeEdicio: resultat.modeEdicio,
            gettingData: false,
        })
    }

    transformaData(time) {
        if (time) {
            let data = new Date(time);
            var date = data.getDate(); //Current Date
            var month = data.getMonth() + 1; //Current Month
            var year = data.getFullYear(); //Current Year
            if (date < 10) date = '0' + date
            if (month < 10) month = '0' + month
            return date + '-' + month + '-' + year
        }
        else return ""
    }

    refresh() {
        this.getDadesUsuari()
    }
    async comprovaPIN(pin) {
        if (this.state.PinParental == pin) {
            await FirebaseAPI.canviarModeEdicio(this.state.currentUser.uid, this.state.modeEdicio)
            //Alert.alert("Alerta", "PIN Correcte", "El mode d'edició quedarà activat fins que es torni a desactivar")
            //
            this.setState({ isDialogVisible: false })
            this.refresh()
            Alert.alert("Alerta", "PIN Correcte")
        }
        else Alert.alert("Alerta", "PIN Incorrecte")
    }

    render() {
        //console.log("hola")
        if (this.state.gettingData) return (<View>
            <View style={{ flex: 1 }}>
                <Header
                    style={{ width: '100%' }}
                    backgroundColor="#00E0B2"
                    leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                    centerComponent={{ text: "PERFIL D'USUARI", style: { color: '#fff', fontSize: 20, } }}
                />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="black"></ActivityIndicator>
            </View>
        </View>)
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Header
                        style={{ width: '100%' }}
                        backgroundColor="#00E0B2"
                        leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                        centerComponent={{ text: "PERFIL D'USUARI", style: { color: '#fff', fontSize: 20, } }}
                    />
                </View>
                <SafeAreaView style={styles.container}>
                    <ScrollView>
                        <View style={styles.textView}>

                            <View style={[styles.dades, { paddingTop: 5 }]}>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textFixe}>NOM</Text>
                                </View>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textUsuari}>{this.state.nom}</Text>
                                </View>
                            </View>
                            <View style={styles.dades}>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textFixe}>COGNOMS</Text>
                                </View>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textUsuari}>{this.state.cognom}</Text>
                                </View>
                            </View>
                            <View style={styles.dades}>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textFixe}>GÈNERE</Text>
                                </View>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textUsuari}>{this.state.genere}</Text>
                                </View>
                            </View>
                            <View style={styles.dades}>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textFixe}>DATA DE NAIXEMENT</Text>
                                </View>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textUsuari}>{this.transformaData(this.state.dataNaixement)}</Text>
                                </View>
                            </View>
                            <View style={styles.dades}>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textFixe}>ADREÇA</Text>
                                </View>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textUsuari}>{this.state.adreça}</Text>
                                </View>
                            </View>
                            <View style={styles.dades}>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textFixe}>POBLACIÓ</Text>
                                </View>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textUsuari}>{this.state.poblacio}</Text>
                                </View>
                            </View>
                            <View style={styles.dades}>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textFixe}>CODI POSTAL</Text>
                                </View>
                                <View style={styles.mitjaZona}>
                                    <Text style={styles.textUsuari}>{this.state.codiPostal}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.seccioBotons}>
                            {/*<DialogInput isDialogVisible={this.state.isDialogVisible}
                                title={"Habilitar edició"}
                                message={"Introdueix el PIN parental per habilitar l'edició"}
                                hintInput={"Exemple: 0000"}
                                submitInput={(inputText) => { this.comprovaPIN(inputText) }}
                                cancelText="Cancelar"
                                submitText="Confirmar"
                                closeDialog={() => { this.setState({isDialogVisible: false}) }}>
        </DialogInput>*/}
                            {<Dialog.Container visible={this.state.isDialogVisible}>
                                <Dialog.Title>Habilitar edició</Dialog.Title>
                                <Dialog.Description>
                                    Introdueix el PIN parental per habilitar l'edició
                                </Dialog.Description>
                                <Dialog.Input
                                    style={{ borderBottomWidth: 1 }}
                                    placeholder="Exemple: 0000"
                                    onChangeText={(pinIntroduit) => this.setState({ pinIntroduit })}>
                                </Dialog.Input>
                                <Dialog.Button label="Cancelar" onPress={() => this.setState({ isDialogVisible: false })} />
                                <Dialog.Button label="Confirmar" onPress={() => this.comprovaPIN(this.state.pinIntroduit)} />
                            </Dialog.Container>}
                            {!this.state.modeEdicio ? <TouchableOpacity
                                onPress={() => {
                                    this.setState({ isDialogVisible: true })
                                }}
                                title="Cancel"
                                style={{ width: '96%', alignItems: 'center', height: 52, justifyContent: 'center', backgroundColor: '#D51313' }}
                            >
                                <View >
                                    <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold' }}>HABILITAR EDICIÓ</Text>

                                </View>
                            </TouchableOpacity> :
                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert(
                                            "Deshabilitar el mode d'edició",
                                            "Estàs segur/a de que vols deshabilitar el mode d'edició?",
                                            [
                                                { text: 'Cancelar', onPress: () => { return null } },
                                                {
                                                    text: 'Confirmar', onPress: async () => {
                                                        await FirebaseAPI.canviarModeEdicio(this.state.currentUser.uid, this.state.modeEdicio)
                                                        Alert.alert("Alerta", "Mode d'edició desactivat")
                                                        this.refresh()
                                                    }

                                                },
                                            ],
                                            { cancelable: false }
                                        )
                                    }}
                                    title="Cancel"
                                    style={{ width: '96%', alignItems: 'center', height: 52, justifyContent: 'center', backgroundColor: '#00E0B2' }}
                                >
                                    <View >
                                        <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold' }}>DESHABILITAR EDICIÓ</Text>

                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textUsuari: {
        fontSize: 20,
    },
    textFixe: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 5,
    },
    dades: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#00E0B2',
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textView: {
        flex: 3,
        fontSize: 40,
        paddingHorizontal: 10,
        //justifyContent: 'space-around'
    },
    mitjaZona: {
        width: "50%",

    },
    seccioBotons: {
        paddingTop: 40,
        alignItems: 'center',

    }

});
