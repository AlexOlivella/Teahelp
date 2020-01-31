
import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, ToastAndroid, FlatList } from "react-native";
import PhoneInput from "react-native-phone-input";
import { TextField } from 'react-native-material-textfield';
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'



export default class AfegirDireccions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            llistaDireccions: "",
            loading: "",
            refresh: this.props.navigation.state.params.refresh(),
            loadingData: true,
            nomDireccio: "",
            direccio: "",
            nomPle: "",
            direccioPlena: "",

        };
    }

    static navigationOptions = {
        title: "AFEGIR DIRECCIONS",
        headerStyle: {
            backgroundColor: '#00E0B2'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 20,
        },
    }

    componentDidMount() {
        this.getLlistaDireccions()
    }

    async getLlistaDireccions() {
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLlistaDireccions(user.uid)
        //console.log("resultat", resultat)
        this.setState(
            {
                llistaDireccions: resultat,
                loadingData: false
            })

    }
    refresh() {
        this.getLlistaDireccions()
    }

    esborrarDireccio(nomDireccio) {
        Alert.alert(
            'Esborrar direcció',
            'Estàs segur/a de que vols esborrar aquesta direcció?',
            [
                { text: 'Cancelar', onPress: () => { return null } },
                {
                    text: 'Confirmar', onPress: async () => {
                        let error
                        let user = firebase.auth().currentUser
                        this.setState({ loading: true })
                        error = await FirebaseAPI.esborrarDireccio(user.uid, nomDireccio)
                        this.setState({ loading: false })
                        if (error) Alert.alert("Alerta", error)
                        else {
                            ToastAndroid.show("Direcció esborrada correctament", ToastAndroid.SHORT)
                            this.props.navigation.state.params.refresh()
                            this.refresh()
                        }

                    }

                },
            ],
            { cancelable: false }
        )
    }

    checkInputs() {
        return true
    }
    render() {
        let loader
        if (this.state.loadingData) return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="black"></ActivityIndicator></View>)
        if (this.state.loading) loader = <View><ActivityIndicator size="large" color="black"></ActivityIndicator></View>
        return (
            <View style={styles.container}>
                <View style={styles.containerInputs}>
                    <View style={styles.inputs}>
                        <TextField
                            label="Nom de la direcció"
                            autoCapitalize="words"
                            onChangeText={nomDireccio => this.setState({ nomDireccio, nomPle: true })}
                            value={this.state.nomDireccio}
                        />
                    </View>
                    <View style={styles.inputs}>
                        <TextField
                            label="Direcció"
                            autoCapitalize="words"
                            onChangeText={direccio => this.setState({ direccio, direccioPlena: true })}
                            value={this.state.direccio}
                        />
                    </View>
                    {/*<TouchableOpacity onPress={this.updateInfo} style={styles.button}>
                        <Text>Get Info</Text>
                    </TouchableOpacity>

                        {this.renderInfo()}*/}

                    {loader}
                    {this.state.nomPle && this.state.direccioPlena ?
                        <View style={{ paddingBottom: 20 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert(
                                        'Afegir direcció',
                                        'Estàs segur/a de que vols afegir aquesta direcció?',
                                        [
                                            { text: 'Cancelar', onPress: () => { return null } },
                                            {
                                                text: 'Confirmar', onPress: async () => {
                                                    let error
                                                    let user = firebase.auth().currentUser
                                                    if (this.checkInputs()) {
                                                        this.setState({ loading: true })
                                                        error = await FirebaseAPI.creaDireccio(user.uid, this.state.nomDireccio, this.state.direccio)
                                                        this.setState({ loading: false })

                                                        if (error) Alert.alert("Alerta", error)
                                                        else {
                                                            ToastAndroid.show("Direcció afegida correctament", ToastAndroid.SHORT)
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
                                    <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold' }}>AFEGIR DIRECCIÓ</Text>

                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        <View>
                        </View>}

                </View>
                <FlatList
                    data={this.state.llistaDireccions}
                    renderItem={({ item }) =>
                        <ListItem containerStyle={{ backgroundColor: "#fff", borderBottomWidth: 1, borderColor: '#00E0B2', }}
                            title={item.nom}
                            subtitle={item.direccio}
                            titleStyle={{ fontSize: 20 }}
                            subtitleStyle={{ paddingTop: 10, fontSize: 20 }}
                            rightElement={
                                <Icon name="delete" onPress={() => this.esborrarDireccio(item.nom)}></Icon>
                            }
                        />
                    }
                    keyExtractor={item => item.nom}
                />
            </View>
        );
    }
}
let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    containerInputs: {
        paddingHorizontal: 10,
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
        paddingBottom: 40,
    }
});

