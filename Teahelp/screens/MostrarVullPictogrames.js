import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Image, Modal, Button, Alert } from 'react-native';
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'
import { EventRegister } from 'react-native-event-listeners'


export default class MostrarVullPictogrames extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opcions: this.props.navigation.getParam('opcions'),
            llistaPictogrames: "",
            isLoading: true,
        }
    }

    static navigationOptions = {
        title: "COSES QUE VULL",
        headerStyle: {
            backgroundColor: '#00E0B2'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 20,
        },

    }

    componentDidMount() {
        this.getLlistaVullPictogrames()
    }

    async getLlistaVullPictogrames() {
        var user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLlistaVullPictogrames(user.uid, this.state.opcions)
        console.log("resultat", resultat)
        this.setState({
            llistaPictogrames: resultat,
            isLoading: false

        })
    }

    render() {
        console.log(this.state.opcions)
        if(this.state.isLoading) return(<View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size="large" color="black"></ActivityIndicator></View>)
        return (
            
            
                <SafeAreaView style={styles.container}>
                    <ScrollView>
                        <FlatList
                            data={this.state.llistaPictogrames}
                            renderItem={({ item }) =>
                                <ListItem
                                containerStyle={styles.pictograma}
                                    title={<View style={{ alignItems: 'center' }}>
                                        <Image source={{ uri: item.imatge }} style={{ width: 100, height: 100 }} resizeMode="contain"></Image>
                                    </View>}
                                    //rightIcon={<Image source={{uri: item.imatge}} style={{width:100, height:100}} resizeMode="contain"></Image>}
                                    subtitle={item.accio}
                                    titleStyle={{ fontSize: 20 }}

                                    subtitleStyle={{ paddingTop: 10, fontSize: 20, textAlign: 'center' }}
                                />
                            }
                            keyExtractor={item => item.accio}
                        />
                    </ScrollView>
                </SafeAreaView>
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
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 30,
        textAlign: 'justify'
    },
    pictograma: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: '#00E0B2',
        flexDirection: 'row'
    },
});
