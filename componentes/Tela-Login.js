import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../modulos/api';
import { User, Lock, Eye, EyeOff, UserLock, Users, CircleUserRound, ChevronRight } from 'lucide-react-native';
import Toast, { ErrorToast } from 'react-native-toast-message';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Login({ aoLogar }) {
    const [carregando, setCarregando] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [autenticado, setAutenticado] = useState(false);


    useEffect(() => {
        verificarLoginExistente();
    }, []);

    const verificarLoginExistente = async () => {
        const token = await AsyncStorage.getItem('@Token');
        const user = await AsyncStorage.getItem('@Nome');

        if (token) {
            setNome(user);
            console.log(nome);
        }
    };

    const verificarBiometria = async () => {

        const compativel = await LocalAuthentication.hasHardwareAsync();

        const cadastrado = await LocalAuthentication.isEnrolledAsync();

        if (!compativel || !cadastrado) {
            return Alert.alert("Erro", "Sensor biométrico não encontrado ou não configurado no sistema.");
        }

        const resultado = await LocalAuthentication.authenticateAsync({
            promptMessage: "Autenticação Biométrica",
            fallbackLabel: "Usar Senha",
        });

        if (resultado.success) {
            setAutenticado(true);
            aoLogar();
        }
    };



    const realizarLogin = async () => {
        setCarregando(true);
        try {
            const response = await api.post('/login', {
                usuario: usuario,
                senha: senha,
            });

            if (response.data.autenticacao) {
                await AsyncStorage.setItem('@Token', response.data.token);
                await AsyncStorage.setItem('@Nome', String(response.data.payload.user));
                await AsyncStorage.setItem('@ID', String(response.data.payload.id));
                await AsyncStorage.setItem('@Permissao', String(response.data.payload.permissao));

                aoLogar();
            } else {
                Alert.alert('Erro de login', response.data.dados || 'Credenciais inválidas');
            }
        } catch (error) {
            //const msg = error.response?.data?.dados || "Erro de conexão com o servidor";
            Toast.show({
                type: 'error',
                text1: 'Login',
                position: 'top',
                bottomOffset: 200,
                text2: 'Usuário ou senha inválidos!'
            });
        } finally {
            setCarregando(false);
        }
    };

    const toastConfig = {
        error: (props) => (
            <ErrorToast
                {...props}
                style={styles.Toast}
                text1Style={{ fontSize: 20, fontWeight: 'bold' }}
                text2Style={{ fontSize: 16 }}
            />
        )
    };

    if (!nome == "") {
        return (

            <View style={styles.container}>

                <View style={styles.menu}>

                    <View style={styles.menuOPT}>
                        <Text style={styles.menuTituloTexto}>Continuar como </Text>
                        <TouchableOpacity style={styles.menuBotao} onPress={() => { setNome(''); }}><Users size={20} style={styles.menuBotaoIcon} /><Text style={styles.menuBotaoTexto}>Alterar conta</Text></TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.menuUsuario} onPress={verificarBiometria}>
                        <CircleUserRound size={50} style={styles.menuUsuarioIcon} />
                        <Text style={styles.menuUsuarioNome} >{nome.length > 26 ? nome.substring(0, 26) + "..." : nome}</Text>
                        <ChevronRight size={50} style={styles.menuUsuarioSeta} />
                    </TouchableOpacity>

                </View>

            </View>

        );
    }

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView style={styles.container} behavior='padding'>

                <Text style={styles.titulo}>Mobile</Text>
                <View style={styles.form}>
                    <View style={styles.areaIcone}>
                        <UserLock color="#107dd6" size={60} style={styles.inputIcon} />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={styles.placeholderTextColor}
                        placeholder="Usuário"
                        value={usuario}
                        onChangeText={setUsuario}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={styles.placeholderTextColor}
                        placeholder="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.botao, carregando && { opacity: 0.7 }]}
                        onPress={realizarLogin}
                        disabled={carregando}
                    >
                        {carregando ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.botaoTexto}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                </View>

            </KeyboardAvoidingView>
            <View style={styles.camadaSuperior}><Toast config={toastConfig} /></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EDF2',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    titulo: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 30,
        letterSpacing: 1
    },
    form: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        borderLeftWidth: 4.5,
        elevation: 8,
        shadowColor: "#000",
        borderColor: '#107dd6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    input: {
        height: 55,
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
        color: '#1F2937',
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16
    },
    inputIcon: {
        marginBottom: 20,
    },
    areaIcone: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    botao: {
        height: 55,
        backgroundColor: '#107dd6',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,

        shadowColor: "#107dd6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    camadaSuperior: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        elevation: 9999,
        pointerEvents: 'box-none'
    },
    Toast: {
        height: 80,
        borderLeftColor: 'red',
        width: '95%',
        margin: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    botaoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    placeholderTextColor: '#9CA3AF',

    menu: {
        backgroundColor: '#b9d6e5',
        borderRadius: 10,
        width: '90%',
        overflow: 'hidden',
        elevation: 10,
        borderWidth: 0.5,
        borderColor: '#2394c04e',

        shadowColor: '#000000',
        shadowOpacity: 0.9,
    },
    menuOPT: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#25a0dedd',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: 'hidden'
    },
    menuBotao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        width: 125,
        backgroundColor: '#107dd6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#107dd6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    menuBotaoTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    menuBotaoIcon: {
        color: '#ffff',
        position: 'relative',
        paddingLeft: 20,
        right: 5
    },
    menuTituloTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10
    },
    menuUsuario: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 8,
        borderRadius: 10,
        borderColor: '#107dd6',
    },
    menuUsuarioIcon: {
        color: '#107dd6',
        position: 'relative',
        paddingRight: 20,
        left: 5
    },
    menuUsuarioSeta: {
        color: '#107dd6',
        position: 'absolute',
        paddingRight: 20,
        left: '90%'
    },
    menuUsuarioNome: {
        color: '#107dd6',
        position: 'relative',
        paddingRight: 20,
        left: 10,
        fontWeight: 'bold',
        bottom: 5
    },
});

//DEPENDÊNCIAS:
//npx expo install expo-local-authentication @react-native-async-storage/async-storage lucide-react-native react-native-toast-message