
import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, ToastAndroid, FlatList } from "react-native";
import PhoneInput from "react-native-phone-input";
import { TextField } from 'react-native-material-textfield';
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown';



export default class AfegirPreferencies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: "",
            type: "",
            value: "",
            loading: "",
            refresh: this.props.navigation.state.params.refresh(),
            llistaContactes: "",
            loadingData: true,
            numContacte1: "",
            nomContacte1: "",
            numContacte2: "",
            nomContacte2: "",
            numContacte3: "",
            nomContacte3: "",
        };
    }

    static navigationOptions = {
        title: "AFEGIR PREFERÈNCIES",
        headerStyle: {
            backgroundColor: '#00E0B2'
        }, 
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 20,
        },
    }

    componentDidMount() {
        this.getLlistaContactes()
        this.getLlistaPreferencies()
    }

    async getLlistaContactes() {
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLlistaContactes(user.uid)
        //console.log("resultat", resultat)
        var result = this.creaDropdown(resultat)
        this.setState(
            {
                llistaContactes: result,
            })

    }
    refresh() {
        this.getLlistaContactes()
    }

    async getLlistaPreferencies(){
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLlistaPreferencies(user.uid)
        console.log(resultat)
        this.setState({
            numContacte1: resultat[0].numContacte,
            nomContacte1: resultat[0].nomContacte,
            numContacte2: resultat[1].numContacte,
            nomContacte2: resultat[1].nomContacte,
            numContacte3: resultat[2].numContacte,
            nomContacte3: resultat[2].nomContacte,
            loadingData: false,

        })
    }
    checkInputs() {

    }

    creaDropdown(llista) {
        result = []
        let dades = llista.map(contacte => { return { numero: contacte.numero, value: contacte.nom } })
        result = [].concat(dades)
        return result
    }

    render() {
        let loader
        if (this.state.loadingData) return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="black"></ActivityIndicator></View>)
        if (this.state.loading) loader = <View><ActivityIndicator size="large" color="black"></ActivityIndicator></View>
        return (
            <View style={styles.container}>
                <View style={styles.viewPreferencia}>
                    <View>
                        <Text style={styles.textTitolPreferencia}>
                            PREFERÈNCIA 1:
                    </Text>
                    </View>
                    <View style={styles.viewDropdown}>
                        <Dropdown
                            label='Selecciona un contacte'
                            data={this.state.llistaContactes}
                            value={this.state.nomContacte1}
                            containerStyle={styles.dropdown}
                            fontSize={25}
                            labelFontSize={15}
                            onChangeText={(itemValue, itemIndex, itemData) => {
                                this.setState({ nomContacte1: itemValue, numContacte1: itemData[itemIndex].numero });
                                //console.log("itemValue", itemValue,/* "itemIndex", itemIndex, "itemData", itemData,*/"itemData[itemIndex].uid", itemData[itemIndex].uid)
                            }}
                        />
                    </View>
                </View>
                <View style={styles.viewPreferencia}>
                    <View>
                        <Text style={styles.textTitolPreferencia}>
                            PREFERÈNCIA 2:
                        </Text>
                    </View>
                    <View style={styles.viewDropdown}>
                        <Dropdown
                            label='Selecciona un contacte'
                            data={this.state.llistaContactes}
                            value={this.state.nomContacte2}
                            fontSize={25}
                            labelFontSize={15}
                            containerStyle={styles.dropdown}
                            onChangeText={(itemValue, itemIndex, itemData) => {
                                this.setState({ nomContacte2: itemValue, numContacte2: itemData[itemIndex].numero });
                                //console.log("itemValue", itemValue,/* "itemIndex", itemIndex, "itemData", itemData,*/"itemData[itemIndex].uid", itemData[itemIndex].uid)
                            }}
                        />

                    </View>
                </View>
                <View style={styles.viewPreferencia}>
                    <View>
                        <Text style={styles.textTitolPreferencia}>
                            PREFERÈNCIA 3:
                        </Text>
                    </View>
                    <View style={styles.viewDropdown}>
                        <Dropdown
                            label='Selecciona un contacte'
                            data={this.state.llistaContactes}
                            value={this.state.nomContacte3}
                            fontSize={25}
                            labelFontSize={15}
                            containerStyle={styles.dropdown}
                            onChangeText={(itemValue, itemIndex, itemData) => {
                                this.setState({ nomContacte3: itemValue, numContacte3: itemData[itemIndex].numero });
                                //console.log("itemValue", itemValue,/* "itemIndex", itemIndex, "itemData", itemData,*/"itemData[itemIndex].uid", itemData[itemIndex].uid)
                            }}
                        />

                    </View>
                </View>
                {loader}
                <View style={styles.viewBotons}>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Guardar preferències',
                                'Estàs segur/a de que vols guardar aquestes preferències?',
                                [
                                    { text: 'Cancelar', onPress: () => { return null } },
                                    {
                                        text: 'Confirmar', onPress: async () => {
                                            //console.log("preferencia 1:", this.state.nomContacte1, this.state.numContacte1)
                                            //console.log("preferencia 2:", this.state.nomContacte2, this.state.numContacte2)
                                            //console.log("preferencia 3:", this.state.nomContacte3, this.state.numContacte3)
                                            let user = firebase.auth().currentUser
                                            this.setState({ loading: true })
                                            await FirebaseAPI.crearPreferencies(user.uid, this.state.numContacte1, this.state.nomContacte1,
                                                this.state.numContacte2, this.state.nomContacte2, this.state.numContacte3, this.state.nomContacte3)
                                            this.setState({ loading: false })
                                            ToastAndroid.show("Preferències canviades correctament", ToastAndroid.SHORT)


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
                            <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold' }}>GUARDAR PREFERÈNCIES</Text>

                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    viewPreferencia: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    viewBotons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textTitolPreferencia: {
        fontSize: 30,

    },
    viewDropdown: {
        //flex:1
        width: "100%"
    },
    dropdown:{
        width:"100%",

    },

});

