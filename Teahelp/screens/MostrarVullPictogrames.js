import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';



export default class MostrarVullPictogrames extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opcions: this.props.navigation.getParam('opcions')
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
    render() {
        console.log(this.state.opcions)
        return (
            <View>
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
    }
});
