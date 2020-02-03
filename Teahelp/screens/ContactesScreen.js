import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'
import call from 'react-native-phone-call';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { EventRegister } from 'react-native-event-listeners'


export default class ContactesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            llistaContactes: [],
            search: '',
            llistaContactesAux: [],
            isLoading: true,
            modeEdicio: "",

        }
        this.arrayHolder = [];

    }
    componentDidMount() {
        this.getModeEdicio()
        this.getLlistaContactes()
    }
    static navigationOptions = {
        headerShown: false
    }
    obrirDrawer = () => {
        this.props.navigation.openDrawer();
    }
    componentWillMount(){
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
    afegirContactes() {
        this.props.navigation.navigate("AfegirContactes", { refresh: () => this.refresh() })
    }

    async getModeEdicio() {
        var user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getDadesUsuari(user.uid)
        this.setState({
            modeEdicio: resultat.modeEdicio
        })
    }

    async getLlistaContactes() {
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLlistaContactes(user.uid)
        //console.log("resultat", resultat)
        this.setState(
            {
                llistaContactes: resultat,
                llistaContactesAux: resultat,
                isLoading: false
            },
            function () {
                this.arrayholder = resultat
            })

    }
    refresh() {
        this.getLlistaContactes()
    }

    search = text => {
        //console.log(text);
    };
    clear = () => {
        this.search.clear();
    };
    SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.nom ? item.nom.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            llistaContactes: newData,
            search: text,
        });
    }
    call(numero) {
        //handler to make a call
        const args = {
          number: numero,
          prompt: false,
        };
        call(args).catch(console.error);
      };
    render() {
        let rightC
        let backGroundHeader 
        if (this.state.modeEdicio){ 
            rightC = <Icon name='settings' color="#fff" onPress={() => this.afegirContactes()} ></Icon>
            backGroundHeader = "#D51313"
    }
    else backGroundHeader = "#00E0B2"
        if (this.state.isLoading) return (<View style={{ flex: 1 }}>
            <View>
                <Header
                    style={{ width: '100%' }}
                    backgroundColor={backGroundHeader}
                    leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                    centerComponent={{ text: 'CONTACTES', style: { color: '#fff', fontSize: 20, } }}
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
                        centerComponent={{ text: 'CONTACTES', style: { color: '#fff', fontSize: 20, } }}
                        rightComponent={rightC}
                    />

                </View>
                <SafeAreaView style={styles.container}>
                    <ScrollView>

                        {this.state.llistaContactesAux == 0 ?
                            <View style={styles.llistaBuida}>
                                <Text style={styles.text}>Encara no has afegit cap contacte a la llista de contactes, prova d'afegir-ne un fent click a l'icona de dalt a la dreta</Text>
                            </View> :
                            <View >
                                <SearchBar
                                    round
                                    searchIcon={{ size: 24 }}
                                    onChangeText={text => this.SearchFilterFunction(text)}
                                    onClear={text => this.SearchFilterFunction('')}
                                    placeholder="Escriu aquí..."
                                    value={this.state.search}
                                    lightTheme
                                    containerStyle={{ backgroundColor: backGroundHeader}}
                                    inputContainerStyle={{ backgroundColor: 'white' }}
                                />
                                <FlatList
                                    data={this.state.llistaContactes}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => { this.call(item.numero)}}>
                                            <ListItem containerStyle={{ backgroundColor: "#fff", borderBottomWidth: 1, borderColor: '#00E0B2' }}
                                                title={item.nom}
                                                subtitle={item.numero}
                                                titleStyle={{ fontSize: 20 }}
                                                subtitleStyle={{ paddingTop: 10, fontSize: 20 }}
                                            />
                                        </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.numero}
                                />
                            </View>}
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
