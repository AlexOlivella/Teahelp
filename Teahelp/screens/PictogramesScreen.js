import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Image, Modal, Button, Alert } from 'react-native';
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'
import { EventRegister } from 'react-native-event-listeners'


export default class ContactesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            modeEdicio: "",
            llistaPictogrames: "",
            currentUser: "",
            selected: {

            },
        }

    }
    select(element) {
        let selected = this.state.selected;
        selected[element] = !selected[element];
        console.log(selected);
        this.setState({ selected: selected })

    }
    refresh() {
        this.getModeEdicio()
        this.getLlistaPictogrames()
    }
    componentDidMount() {
        this.getModeEdicio()
        this.getLlistaPictogrames()
    }
    componentWillMount() {
        this.listener = EventRegister.addEventListener('modeEdicio', (data) => {
            /*this.setState({
				data: data.toString(),
                modeEdicio:data.toString(),
			})*/
            this.getModeEdicio()
        })
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
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
    async getLlistaPictogrames() {
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLListaPictogrames(user.uid)
        console.log("resultat imatge", resultat)
        this.setState({
            currentUser: user,
            llistaPictogrames: resultat,
            isLoading: false
        })
    }
    mostraVull() {
        let opcions = []
        for (let opcio in this.state.selected) {
            if (this.state.selected[opcio])
                opcions.push(opcio)
        }
        if (opcions.length != 0) {
            this.props.navigation.navigate(
                "MostrarVullPictogrames",
                {
                    opcions: opcions
                }
            )
        }
        else Alert.alert("ALERTA", "TRIA UN PICTOGRAMA DE LA LLISTA")
        //console.log("medicaments")

    }

    render() {
        let rightC
        let backGroundHeader
        if (this.state.modeEdicio) {
            rightC = <Icon name='settings' color="#fff" onPress={() => this.afegirPictograma()} ></Icon>
            backGroundHeader = "#D51313"

        }
        else backGroundHeader = "#00E0B2"
        if (this.state.isLoading) return (<View style={{ flex: 1 }}>
            <View>
                <Header
                    style={{ width: '100%' }}
                    backgroundColor={backGroundHeader}
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
                        backgroundColor={backGroundHeader}
                        leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                        centerComponent={{ text: 'PICTOGRAMES', style: { color: '#fff', fontSize: 20, } }}
                        rightComponent={rightC}
                    />

                </View>
                <SafeAreaView style={styles.container}>
                    <ScrollView>
                        <FlatList
                            data={this.state.llistaPictogrames}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => this.select(item.accio)}>
                                    <ListItem
                                        containerStyle={this.state.selected[item.accio] ? styles.seleccionat : styles.noSeleccionat}
                                        title={<View style={{ alignItems: 'center' }}>
                                            <Image source={{ uri: item.imatge }} style={{ width: 100, height: 100 }} resizeMode="contain"></Image>
                                        </View>}
                                        //rightIcon={<Image source={{uri: item.imatge}} style={{width:100, height:100}} resizeMode="contain"></Image>}
                                        subtitle={item.accio}
                                        titleStyle={{ fontSize: 20 }}

                                        subtitleStyle={{ paddingTop: 10, fontSize: 20, textAlign: 'center' }}
                                    />
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.accio}
                        />
                    </ScrollView>
                </SafeAreaView>

                <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10, backgroundColor: '#fff' }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.mostraVull()
                        }}
                        title="Cancel"
                        style={{ width: '96%', alignItems: 'center', height: 52, justifyContent: 'center', backgroundColor: '#00E0B2' }}
                    >
                        <View >
                            <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold' }}>COSES QUE VULL</Text>

                        </View>
                    </TouchableOpacity>
                </View>
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
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 30,
        textAlign: 'justify'
    },
    noSeleccionat: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: '#00E0B2',
        flexDirection: 'row'
    },
    seleccionat: {
        backgroundColor: "#C9FCE9",
        borderBottomWidth: 1,
        borderColor: '#00E0B2',
        flexDirection: 'row'
    }
});
