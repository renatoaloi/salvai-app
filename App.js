/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight, ProgressBarAndroid, TextInput, Image } from 'react-native';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNReactNativeSelectAllImages from 'react-native-select-all-images';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            processadas: 0,
            progress: 0.0,
            imagens: [],
            text: '',
            cancel: false
        };
    }

    _onCancel = () => {
        this.setState({ cancel: true });
    }

    _processImage = async (imagem) => {

        const configImg = {
            method: 'post',
            headers: {
                'token': 'nada',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            }
        };

        const form = new FormData();
        form.append('image', {
            uri: 'file://' + imagem.DATA,
            type: 'image/jpeg',
            name: imagem.DISPLAY_NAME
        });
        form.append('original_path', imagem.DATA.substring(
            imagem.DATA.indexOf('/storage/emulated/0') + 19,
            imagem.DATA.lastIndexOf('/')));

        const url = 'http://' + this.state.text + ':3000/upload';
        configImg.body = form;

        try {
            const res = await fetch(url, configImg);
            const j = await res.text(); //.json();
            status = res.status;
            console.log('j', j);
            //response = 'OK';
            //a[i] = { name: 'picture', value: j.result.fileId };
            //response += ' img: ' + j.result.fileId;
        } catch (e) {
            //status = 500;
            //response = e.message;
            console.log('erro', e);
        }

        const processadas = this.state.processadas + 1;
        const progress = processadas / this.state.total;

        this.setState({
            processadas,
            progress
        });
    }

    _onProcess = async () => {
        for (var i = 0; i < this.state.imagens.length; i++) {
            if (this.state.cancel) break;
            await this._processImage(this.state.imagens[i]);
        }
        this.setState({ cancel: false });
    }

    _onPress1 = () => {
        ImagePicker.openPicker({
            multiple: true
        }).then(async (images) => {
            console.log(images);
        });
    }

    _onPress = () => {

        RNReactNativeSelectAllImages.getImages().then(imagens => {
            console.log(imagens);
            this.setState({ total: imagens.length, imagens });
        });



        /* // More info on all the options is below in the API Reference... just some common use cases shown here
        const options = {
            title: 'Selecione Fotos',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }; */

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        /* ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                //const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                });

                console.log('source', response.uri);
            }
        }); */
    }
    
    render() {
        console.log(this.state);
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                    placeholder={'Digite o IP do servidor'}
                />
                <View style={styles.tableView}>
                    <View style={styles.rowView}>
                        <Text style={styles.cellView}>Total</Text>
                        <Text style={styles.cellView}>Processadas</Text>
                    </View>
                    <View style={styles.rowView}>
                        <Text style={styles.cellView}>{this.state.total}</Text>
                        <Text style={styles.cellView}>{this.state.processadas}</Text>
                    </View>
                </View>
                <TouchableHighlight style={styles.button} onPress={this._onPress1}>
                    <Text>Selecionar Imagens</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button} onPress={this._onPress}>
                    <Text>Selecionar Todas Imagens</Text>
                </TouchableHighlight>
                <ProgressBarAndroid
                    style={styles.progressBar}
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={this.state.progress}
                />
                {this.state.imagens.length > 0 && (
                    <View>
                        <TouchableHighlight style={styles.button} onPress={this._onProcess}>
                            <Text>Processar Imagens</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.button} onPress={this._onCancel}>
                            <Text>Cancelar</Text>
                        </TouchableHighlight>
                        {/* <Image 
                            style={{width: 150, height: 150}}
                            source={{ uri: 'file://' + this.state.imagens[10].DATA }} 
                        /> */}
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginTop: 20
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    tableView: {
        flexDirection: 'column',

    },
    rowView: {
        flexDirection: 'row',
    },
    cellView: {
        height: 30,
        width: 100
    },
    progressBar: {
        marginTop: 20,
        width: '100%'
    },
    textInput: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20
    }
});
