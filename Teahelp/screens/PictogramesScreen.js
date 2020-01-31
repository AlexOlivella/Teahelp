import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'
import call from 'react-native-phone-call';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';


export default class ContactesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            modeEdicio: "",

        }
        this.arrayHolder = [];

    }
    refresh(){
        this.getModeEdicio()
    }
    componentDidMount() {
        this.getModeEdicio()
    }
    static navigationOptions = {
        headerShown: false
    }
    obrirDrawer = () => {
        this.props.navigation.openDrawer();
    }

    afegirPictograma() {
        this.props.navigation.navigate("AfegirPictogrames", { refresh: () => this.refresh() })
    }

    async getModeEdicio() {
        var user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getDadesUsuari(user.uid)
        this.setState({
            modeEdicio: resultat.modeEdicio
        })
    }

   

    render() {
        let rightC
        if (this.state.modeEdicio) rightC = <Icon name='settings' color="#fff" onPress={() => this.afegirPictograma()} ></Icon>
        if (this.state.isLoading) return (<View style={{ flex: 1 }}>
            <View>
                <Header
                    style={{ width: '100%' }}
                    backgroundColor="#00E0B2"
                    leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                    centerComponent={{ text: 'PICTOGRAMES', style: { color: '#fff', fontSize: 20, } }}
                    rightComponent={rightC}
                />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="black"></ActivityIndicator>
            </View></View>)
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Header
                        style={{ width: '100%' }}
                        backgroundColor="#00E0B2"
                        leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                        centerComponent={{ text: 'PICTOGRAMES', style: { color: '#fff', fontSize: 20, } }}
                        rightComponent={rightC}
                    />

                </View>
                <SafeAreaView style={styles.container}>
                    <ScrollView>

                    </ScrollView>
                </SafeAreaView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    llistaBuida: {
        paddingTop: 200,
        paddingHorizontal:10,
    },
    text: {
        fontSize: 30,
        textAlign: 'justify'
    }
});
