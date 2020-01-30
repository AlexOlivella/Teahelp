
import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, ToastAndroid, FlatList } from "react-native";
import PhoneInput from "react-native-phone-input";
import { TextField } from 'react-native-material-textfield';
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'



export default class AfegirContactes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: "",
            type: "",
            value: "",
            nomContacte: "",
            nomPle: "",
            numPle: "",
            loading: "",
            refresh: this.props.navigation.state.params.refresh(),
            llistaContactes: "",
            loadingData: true

        };
        this.updateInfo = this.updateInfo.bind(this);
        this.renderInfo = this.renderInfo.bind(this);
    }

    static navigationOptions = {
        title: "AFEGIR CONTACTES",
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
    }

    async getLlistaContactes() {
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLlistaContactes(user.uid)
        console.log("resultat", resultat)
        this.setState(
            {
                llistaContactes: resultat,
                loadingData: false
            })

    }
    updateInfo() {
        this.setState({
            valid: this.phone.isValidNumber(),
            type: this.phone.getNumberType(),
            value: this.phone.getValue(),
        });
    }
    refresh(){
        this.getLlistaContactes()
    }
    renderInfo() {
        if (this.state.value) {
            return (
                <View style={styles.info}>
                    <Text>
                        Is Valid:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                            {this.state.valid.toString()}
                        </Text>
                    </Text>
                    <Text>
                        Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
                    </Text>
                    <Text>
                        Value:{" "}
                        <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
                    </Text>
                </View>
            );
        }
    }


    checkInputs() {
        if (this.state.valid) {
            return true
        }
        else Alert.alert("Alerta", "El número que has afegit no és vàlid")
    }
    render() {
        let loader
        if (this.state.loadingData) return(<View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size="large" color="black"></ActivityIndicator></View>)
        if (this.state.loading) loader = <View><ActivityIndicator size="large" color="black"></ActivityIndicator></View>
        return (
            <View style={styles.container}>
                <View style={styles.containerInputs}>
                    <View style={styles.inputs}>
                        <TextField
                            label="Nom del contacte"
                            onChangeText={nomContacte => this.setState({ nomContacte, nomPle: true })}
                            value={this.state.nomContacte}
                        />
                    </View>
                    <View style={styles.inputs}>
                        <PhoneInput
                            ref={ref => {
                                this.phone = ref;
                            }}
                            style={{ borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: '#D3D0D0' }}
                            initialCountry='es'
                            onChangePhoneNumber={() => this.setState({ numPle: true })}
                            cancelText="Cancelar"
                            confirmText="Confirmar"
                            textProps={{ placeholder: 'Exemple: 123456789' }}
                        />
                    </View>
                    {/*<TouchableOpacity onPress={this.updateInfo} style={styles.button}>
                        <Text>Get Info</Text>
                    </TouchableOpacity>

                        {this.renderInfo()}*/}

                    {loader}
                    {this.state.nomPle && this.state.numPle ?
                        <TouchableOpacity
                            onPress={() => {
                                this.updateInfo()
                                Alert.alert(
                                    'Afegir contacte',
                                    'Estàs segur/a de que vols afegir aquest contacte?',
                                    [
                                        { text: 'Cancelar', onPress: () => { return null } },
                                        {
                                            text: 'Confirmar', onPress: async () => {
                                                let error
                                                let user = firebase.auth().currentUser
                                                if (this.checkInputs()) {
                                                    this.setState({ loading:true })
                                                    error = await FirebaseAPI.creaContacte(user.uid, this.state.nomContacte, this.state.value)
                                                    this.setState({ loading:false })

                                                    if (error) Alert.alert("Alerta", error)
                                                    else {
                                                        ToastAndroid.show("Contacte afegit correctament", ToastAndroid.SHORT)
                                                        this.props.navigation.state.params.refresh()
                                                        this.refresh()
                                                    }
                                                }
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
                                <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold' }}>AFEGIR CONTACTE</Text>

                            </View>
                        </TouchableOpacity>
                        :
                        <View>
                        </View>}
                    
                </View>
                <FlatList
                        data={this.state.llistaContactes}
                        renderItem={({ item }) =>
                            <ListItem containerStyle={{ backgroundColor: "#fff", borderBottomWidth: 1, borderColor: '#00E0B2' }}
                                title={item.nom}
                                subtitle={item.numero}

                            />
                        }
                        keyExtractor={item => item.numero}
                    />
            </View>
        );
    }
}
let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    containerInputs:{
        paddingHorizontal:10,
    },
    info: {
        // width: 200,
        borderRadius: 5,
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginTop: 20
    },
    button: {
        marginTop: 20,
        padding: 10
    },
    inputs: {
        paddingBottom: 40
    }
});

