import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';



export default class NomClasse extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static navigationOptions = {
        headerShown: false
    }
    render() {

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
