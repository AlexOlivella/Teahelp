import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import firebase from 'firebase'


export default class ForgotPasword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',

        }
    }
    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#00E0B2'
        },
        title:"RESTABLIR CONTRASSENYA",
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 20,
        },
    }
    checkInput() {
        if (this.state.email != '') {
            //alert('Success')
            return true;
        } else {
            alert('Introdueix un email vàlid');
        }
    }
    forgotPassword(Email) {
        if (this.checkInput()) {
            firebase.auth().sendPasswordResetEmail(Email.trim())
                .then(function (user) {
                    alert('Comprova el teu email...')
                }).catch(function (e) {
                    alert(e)
                })
        }
    }
    render() {

        return (
            <View style={styles.container}>
                <View style={{ flex: 0.5 }}></View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 30, textAlign:'center' }}>T'has oblidat de la contrassenya?</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <TextField
                        label="Email"
                        onChangeText={(email) => this.setState({ email })}
                        autoCapitalize="none"
                        value={this.state.email}
                    />
                </View>
                <Button
                    title='Envia Email'
                    color="#00E0B2"
                    onPress={() => this.forgotPassword(this.state.email)}>
                    
                </Button>
                <View style={{ flex: 3 }}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        justifyContent: 'space-around',
    }
});
