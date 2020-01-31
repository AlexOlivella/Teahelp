import React, { Component } from 'react';
import { Picker, Platform, StyleSheet, Text, View, Button, TextInput, ScrollView, Alert, ToastAndroid, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI';
import { TextField } from 'react-native-material-textfield';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Dropdown } from 'react-native-material-dropdown';
import PasswordInputText from 'react-native-hide-show-password-input';
import Constants from 'expo-constants';
import { HitTestResultTypes } from 'expo/build/AR';

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            password: "",
            birthday: "",
            gender: "",
            trastorn: "",
            email: "",
            isDateTimePickerVisible: false,
            adreça: "",
            poblacio: "",
            codiPostal: "",
        }

    };
    static navigationOptions = {
        title: "Enregistrament d'usuari",
        headerStyle: {
            backgroundColor: '#00E0B2'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 20,
        },
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = (date) => {
        //console.log("A date inicial has been picked: ", date);
        this.setState({ birthday: date.getTime(), dateSelected: true })
        this.hideDateTimePicker();

    };

    CheckTextInput = () => {
        //Handler for the Submit onPress
        if (this.state.firstName != '') {
            //Check for the Name TextInput
            if (this.state.firstName != '') {
                if (this.state.password != '') {
                    //Check for the Email TextInput
                    if (this.state.email != '') {
                        if (this.state.gender != '') {
                            if (this.state.trastorn != '') {
                                if (this.state.birthday != '') {
                                    if (this.state.adreça != '') {
                                        if (this.state.poblacio != '') {
                                            if (this.state.codiPostal != '') {
                                                return true
                                            }
                                        }
                                    }
                                    //alert('Success')
                                } else {
                                    Alert.alert("Alerta!", "Introdueix una data de naixement");
                                }
                            }
                            else {
                                Alert.alert("Alerta!", "Introdueix el tipus de transtorn")
                            }
                        } else {
                            Alert.alert('Alerta!', 'Introdueix un gènere');
                        }
                    } else {
                        Alert.alert('Alerta!', 'Introdueix un email vàlid');
                    }
                } else {
                    Alert.alert('Alerta!', 'Introdueix una contrassenya');
                }
            } else {
                Alert.alert('Alerta!', 'Introdueix els cognoms');
            }
        } else {
            Alert.alert('Alerta!', 'Introdueix el nom');
        }
        return false;
    };
    async createUser() {
        var { navigation } = this.props;
        var navigate = navigation.navigate;
        if (this.CheckTextInput()) {
            let response = await FirebaseAPI.createUser(
                this.state.firstName.trim(),
                this.state.lastName.trim(),
                this.state.password,
                this.state.email.trim(),
                this.state.gender,
                this.state.trastorn,
                this.state.birthday,
                this.createCode().toString(),
                );
            //console.log("birthday", this.state.birthday)
            if (response.isError) {
                //if(response.error == 200)
                if (response.error.code == "auth/invalid-email") {
                    Alert.alert("Alerta!", "El format del email és incorrecte\nProva alguna cosa com: exemple@email.com")
                }
                else if (response.error.code == "auth/weak-password") {
                    Alert.alert("Alerta!", "La teva contrassenya és molt curta, ha de tenir com a mínim 6 caràcters")
                }
                else alert(response.error.code)
            } else {
                ToastAndroid.show("Hola, t'has enregistrat correctament a Teahelp!", ToastAndroid.SHORT)
                navigate("BOTÓ")
            }
        }
    }
    transformaData(time) {
        if (time) {
            let data = new Date(time);
            var date = data.getDate(); //Current Date
            var month = data.getMonth() + 1; //Current Month
            var year = data.getFullYear(); //Current Year
            return date + '-' + month + '-' + year
        }
        else return ""
    }
    createCode() {
        var result = '';
        var result2 = '';
        var characters2 = '123456789';
        // var charactersLength = characters.length;
        var charactersLength2 = characters2.length;
        for (var j = 0; j < 4; j++) {
            result2 += characters2.charAt(Math.floor(Math.random() * charactersLength2));
        }
        return result = result2;
    }
    render() {
        //console.log(this.props)
        return (
            <SafeAreaView style={styles.container}>

                <ScrollView>
                    <View style={styles.textinput}>
                        <View style={styles.inputs}>
                            <TextField
                                label="Nom"
                                onChangeText={firstName => this.setState({ firstName })}
                                value={this.state.firstName}
                            />
                        </View>
                        <View style={styles.inputs}>
                            <TextField
                                label="Cognoms"
                                onChangeText={lastName => this.setState({ lastName })}
                                value={this.state.lastName}
                            />
                        </View>

                        <View style={styles.inputs}>
                            <PasswordInputText
                                label="Contrasenya"
                                getRef={input => this.input = input}
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                            />
                        </View>

                        <View style={styles.inputs}>
                            <TextField
                                label="Email"
                                onChangeText={(v) => this.setState({ email: v })}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={this.state.email}
                            />
                        </View>

                        <View style={styles.inputs}>
                            <Dropdown
                                label='Gènere'
                                data={[{
                                    value: "Masculí"
                                }, {
                                    value: "Femení"
                                }, {
                                    value: "Altres"
                                }]}
                                value={this.state.gender}
                                onChangeText={(itemValue) => this.setState({ gender: itemValue })}
                            />
                        </View>
                        <View style={styles.inputs}>
                            <TextField
                                label="Especifica la tipologia de trastorn"
                                onChangeText={trastorn => this.setState({ trastorn })}
                                value={this.state.trastorn}
                            />
                        </View>
                        <View style={styles.inputs}>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                                mode='date'
                            />

                            <TouchableOpacity onPress={this.showDateTimePicker} >
                                {!this.state.dateSelected &&
                                    <View style={{}}>
                                        <Text style={{ fontSize: 16, color: '#B9ACAC', borderBottomColor: '#D3D0D0', borderBottomWidth: 1 }}>Selecciona la data de naixement</Text>
                                    </View>}

                                {this.state.dateSelected &&
                                    <View style={{}}>
                                        <Text style={{ fontSize: 12, color: '#0091EA' }}>Selecciona la data de naixement</Text>
                                        <Text style={{ fontSize: 16, borderBottomColor: '#D3D0D0', borderBottomWidth: 1, }}>{this.transformaData(this.state.birthday)}</Text>
                                    </View>}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputs}>
                            <TextField
                                label="Adreça"
                                onChangeText={(adreça) => this.setState({ adreça })}
                                value={this.state.adreça}
                            />
                        </View>
                        <View style={styles.inputs}>
                            <TextField
                                label="Població"
                                onChangeText={(poblacio) => this.setState({ poblacio })}
                                value={this.state.poblacio}
                            />
                        </View>
                        <View style={styles.inputs}>
                            <TextField
                                label="Codi postal"
                                onChangeText={(codiPostal) => this.setState({ codiPostal })}
                                keyboardType="phone-pad"
                                value={this.state.codiPostal}
                            />
                        </View>
                    </View>
                    <View style={styles.seccioBotons}>
                        <View style={{ width: "90%" }} >
                            <Button
                                color="#00E0B2"
                                onPress={() => {
                                    this.createUser();

                                }} title="Registra't!"> </Button>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    textinput: {
        flex: 4,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    seccioBotons: {
        flex: 1,
        paddingBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',

    },
    inputs: {
        width: "100%",
        paddingBottom: 40,
    }

});