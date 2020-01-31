
import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, ToastAndroid, FlatList, Image, SafeAreaView, ScrollView } from "react-native";
import PhoneInput from "react-native-phone-input";
import { TextField } from 'react-native-material-textfield';
import * as FirebaseAPI from '../firebaseAPI/firebaseAPI'
//import firebase from 'firebase'
import { Header, Icon, SearchBar, ListItem, } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase/app';
import 'firebase/storage';


export default class AfegirPictogrames extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: "",
            llistaPictogrames: "",
            refresh: this.props.navigation.state.params.refresh(),
            loadingData: true,
            nomAccio: "",
            foto: null,
            accioPlena: "",
            fotoPlena: "",
            currentUser: "",
            urlImatge: "",
        };
    }

    static navigationOptions = {
        title: "AFEGIR PICTOGRAMES",
        headerStyle: {
            backgroundColor: '#00E0B2'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 20,
        },
    }
    getPermissionAsync = async () => {
        if (Constants.platform) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Perdó però necessitem els permisos de càmera perquè això funcioni!');
            }
        }
    }
    componentDidMount() {
        this.getLlistaPictogrames()

    }

    refresh() {
        this.getLlistaPictogrames()
    }
    async pickImage() {
        this.getPermissionAsync()

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            width: 100,
            height: 100
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ foto: result.uri, fotoPlena: true });
        }
    }

    uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                // return the blob
                resolve(xhr.response);
            };

            xhr.onerror = function () {
                // something went wrong
                reject(new Error('uriToBlob failed'));
            };
            // this helps us get a blob
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);

            xhr.send(null);
        });
    }
    uploadToFirebase = (blob) => {

        return new Promise((resolve, reject) => {

            var storageRef = firebase.storage().ref();

            storageRef.child(this.state.currentUser.uid + '/pictogrames/' + this.state.nomAccio).put(blob, {
                contentType: 'image/jpeg'
            }).then(async (snapshot) => {
                //console.log("current user", this.state.currentUser.uid)
                //console.log("nom accio", this.state.nomAccio)
                let url = await firebase.storage().ref(this.state.currentUser.uid + '/pictogrames/' + this.state.nomAccio).getDownloadURL()
                //console.log("url firebase", url)
                this.setState({ urlImatge: url })
                blob.close();

                resolve(snapshot);

            }).catch((error) => {

                reject(error);

            });

        });


    }
    handleOnPress = () => {

        return this.uriToBlob(this.state.foto)
            .then((blob) => {

                return this.uploadToFirebase(blob);

            }).then(async (snapshot) => {

                console.log("File uploaded");

            }).catch((error) => {

                throw error;

            });

    }

    async getLlistaPictogrames() {
        let user = firebase.auth().currentUser
        let resultat = await FirebaseAPI.getLListaPictogrames(user.uid)
        console.log("resultat imatge", resultat)
        this.setState({
            currentUser: user,
            llistaPictogrames: resultat,
            loadingData: false,
        })
    }

    deletePictograma(accio) {
        Alert.alert(
            'Esborrar pictograma',
            'Estàs segur/a de que vols esborrar aquest pictograma?',
            [
                { text: 'Cancelar', onPress: () => { return null } },
                {
                    text: 'Confirmar', onPress: async () => {
                        let error
                        let user = firebase.auth().currentUser
                        this.setState({ loading: true })
                        error = await FirebaseAPI.esborrarPictograma(user.uid, accio)
                        this.setState({ loading: false })

                        ToastAndroid.show("Picograma esborrat correctament", ToastAndroid.SHORT)
                        this.props.navigation.state.params.refresh()
                        this.refresh()


                    }

                },
            ],
            { cancelable: false }
        )
    }
    render() {
        let loader
        if (this.state.loadingData) return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="black"></ActivityIndicator></View>)
        if (this.state.loading) loader = <View><ActivityIndicator size="large" color="black"></ActivityIndicator></View>
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.containerInputs}>
                        <View style={styles.inputs}>
                            <TextField
                                label="Nom de l'acció"
                                placeholder="EXEMPLE: VULL..."
                                autoCapitalize="characters"
                                fontSize={30}
                                labelFontSize={20}
                                onChangeText={nomAccio => this.setState({ nomAccio, accioPlena: true })}
                                value={this.state.nomAccio}
                            />
                        </View>

                        <TouchableOpacity onPress={() => this.pickImage()}
                            style={{ width: '96%', alignItems: 'center', height: 52, justifyContent: 'center', backgroundColor: '#00E0B2' }}
                        >
                            <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold' }}>SELECCIONA UNA IMATGE</Text>
                        </TouchableOpacity>
                        {this.state.foto &&
                            <View style={styles.viewFoto}>
                                <Image source={{ uri: this.state.foto }} style={{ width: 200, height: 200 }} />
                            </View>}


                        {loader}
                        {this.state.nomAccio && this.state.fotoPlena ?
                            <View style={{ paddingBottom: 20 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert(
                                            'Afegir pictograma',
                                            'Estàs segur/a de que vols afegir aquest pictograma?',
                                            [
                                                { text: 'Cancelar', onPress: () => { return null } },
                                                {
                                                    text: 'Confirmar', onPress: async () => {
                                                        this.setState({ loading: true })
                                                        // console.log(this.state.foto)
                                                        //this.uriToBlob(this.state.foto)
                                                        //console.log("blob: ", blob) 

                                                        await this.handleOnPress()
                                                        console.log("urlImatge", this.state.urlImatge)
                                                        await FirebaseAPI.crearPictograma(this.state.currentUser.uid, this.state.nomAccio.trim(), this.state.urlImatge)

                                                        this.setState({ loading: false })
                                                        ToastAndroid.show("Pictograma afegit correctament", ToastAndroid.SHORT)
                                                        this.props.navigation.state.params.refresh()
                                                        this.refresh()
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
                                        <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold' }}>AFEGIR PICTOGRAMA</Text>

                                    </View>
                                </TouchableOpacity>
                            </View>
                            :
                            <View>
                            </View>}

                    </View>
                    <FlatList
                        data={this.state.llistaPictogrames}
                        renderItem={({ item }) =>
                            <ListItem containerStyle={{ backgroundColor: "#fff", borderBottomWidth: 1, borderColor: '#00E0B2' }}
                                title={item.accio}
                                rightIcon={
                                    <View style={styles.viewFotoEsborrar}>

                                        <Image source={{ uri: item.imatge }} style={{ width: 50, height: 50 }} resizeMode="contain"></Image>
                                        <View style={{justifyContent:'center'}}>
                                            <Icon name="delete" onPress={()=>this.deletePictograma(item.accio)}></Icon>

                                        </View>
                                    </View>
                                }
                                titleStyle={{ fontSize: 20 }}
                                subtitleStyle={{ paddingTop: 10, fontSize: 20 }}
                            />
                        }
                        keyExtractor={item => item.accio}
                    />
                </ScrollView>
            </SafeAreaView>
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
    },
    viewFoto: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    viewFotoEsborrar: {
        flexDirection: 'row',
        flex: 0.45,
        justifyContent:'space-between'
    }
});

