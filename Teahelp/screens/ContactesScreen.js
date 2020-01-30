import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'


export default class ContactesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            llistaContactes: [],
            search: '',
            llistaContactesAux: [],
            isLoading: true,


        }
        this.arrayHolder = [];

    }
    componentDidMount() {
        this.getLlistaContactes()
    }
    static navigationOptions = {
        header: null
    }
    obrirDrawer = () => {
        this.props.navigation.openDrawer();
    }

    afegirContactes() {
        this.props.navigation.navigate("AfegirContactes", { refresh: () => this.refresh() })
    }

    async getLlistaContactes() {
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLlistaContactes(user.uid)
        console.log("resultat", resultat)
        this.setState(
            {
                llistaContactes: resultat,
                llistaContactesAux:resultat,
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
        console.log(text);
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

    render() {
        if (this.state.isLoading) return (<View style={{ flex: 1 }}>
            <View>
                <Header
                    style={{ width: '100%' }}
                    backgroundColor="#00E0B2"
                    leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                    centerComponent={{ text: 'CONTACTES', style: { color: '#fff', fontSize: 20, } }}
                    rightComponent={<Icon name='settings' color="#fff" onPress={() => this.afegirContactes()} ></Icon>}
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
                        centerComponent={{ text: 'CONTACTES', style: { color: '#fff', fontSize: 20, } }}
                        rightComponent={<Icon name='settings' color="#fff" onPress={() => this.afegirContactes()} ></Icon>}
                    />

                </View>
                <SafeAreaView style={styles.container}>
                    <ScrollView>

                        {this.state.llistaContactesAux == 0 ?
                            <View style={styles.llistaBuida}>
                                <Text style={styles.text}>Encara no has afegit cap contacte a la llista de contactes, prova d'afegir-ne un fent click a l'icona de dalt a la dreta</Text>
                            </View> :
                            <View>
                                <SearchBar
                                    round
                                    searchIcon={{ size: 24 }}
                                    onChangeText={text => this.SearchFilterFunction(text)}
                                    onClear={text => this.SearchFilterFunction('')}
                                    placeholder="Escriu aquí..."
                                    value={this.state.search}
                                    lightTheme
                                    containerStyle={{ backgroundColor: '#00E0B2' }}
                                    inputContainerStyle={{ backgroundColor: 'white' }}
                                />
                                <FlatList
                                    data={this.state.llistaContactes}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => { }}>
                                            <ListItem containerStyle={{ backgroundColor: "#fff", borderBottomWidth: 1, borderColor: '#00E0B2' }}
                                                title={item.nom}
                                                subtitle={item.numero}
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
        paddingTop: 200
    },
    text: {
        fontSize: 30,
        textAlign: 'justify'
    }
});
