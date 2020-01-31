import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
import firebase from 'firebase'

export default class DireccionsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            llistaDireccions: [],
            search: '',
            llistaDireccionsAux: [],
            isLoading: true,
            modeEdicio: "",

        }
        this.arrayHolder = [];

    }
    componentDidMount() {
        this.getModeEdicio()
        this.getLlistaDireccions()
    }
    static navigationOptions = {
        headerShown: false
    }
    obrirDrawer = () => {
        this.props.navigation.openDrawer();
    }

    afegirDireccions() {
        this.props.navigation.navigate("AfegirDireccions", { refresh: () => this.refresh() })
    }

    async getModeEdicio() {
        var user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getDadesUsuari(user.uid)
        this.setState({
            modeEdicio: resultat.modeEdicio
        })
    }

    async getLlistaDireccions() {
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLlistaDireccions(user.uid)
        //console.log("resultat", resultat)
        this.setState(
            {
                llistaDireccions: resultat,
                llistaDireccionsAux: resultat,
                isLoading: false
            },
            function () {
                this.arrayholder = resultat
            })

    }
    refresh() {
        this.getLlistaDireccions()
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
            llistaDireccions: newData,
            search: text,
        });
    }
    render() {
        let rightC
        if (this.state.modeEdicio) rightC = <Icon name='settings' color="#fff" onPress={() => this.afegirDireccions()} ></Icon>
        if (this.state.isLoading) return (<View style={{ flex: 1 }}>
            <View>
                <Header
                    style={{ width: '100%' }}
                    backgroundColor="#00E0B2"
                    leftComponent={<Icon name='menu' color="#fff" onPress={() => this.obrirDrawer()} />}
                    centerComponent={{ text: 'DIRECCIONS', style: { color: '#fff', fontSize: 20, } }}
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
                        centerComponent={{ text: 'DIRECCIONS', style: { color: '#fff', fontSize: 20, } }}
                        rightComponent={rightC}
                    />

                </View>
                <SafeAreaView style={styles.container}>
                    <ScrollView>

                        {this.state.llistaDireccionsAux == 0 ?
                            <View style={styles.llistaBuida}>
                                <Text style={styles.text}>Encara no has afegit cap direcció a la llista de direccions, prova d'afegir-ne una fent click a l'icona de dalt a la dreta</Text>
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
                                    containerStyle={{ backgroundColor: '#00E0B2' }}
                                    inputContainerStyle={{ backgroundColor: 'white' }}
                                />
                                <FlatList
                                    data={this.state.llistaDireccions}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => {}}>
                                            <ListItem containerStyle={{ backgroundColor: "#fff", borderBottomWidth: 1, borderColor: '#00E0B2' }}
                                                title={item.nom}
                                                subtitle={item.direccio}
                                                titleStyle={{ fontSize: 20 }}
                                                subtitleStyle={{ paddingTop: 10, fontSize: 20 }}
                                            />
                                        </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.nom}
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
        paddingHorizontal:10
    },
    text: {
        fontSize: 30,
        textAlign: 'justify'
    }
});

