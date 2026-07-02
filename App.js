import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StatusBar, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './modulos/api'; 
import Login from './componentes/Tela-Login';
import CardMenu from './componentes/CardMenuGrid';
import { 
  LogOut, Search, Trash2, Edit3, PlusCircle, 
  LayoutDashboard, UserCircle, Settings, Menu as MenuIcon, X 
} from 'lucide-react-native';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

export default function App() {
  const [carregando, setCarregando] = useState(false);
  const [estaLogado, setEstaLogado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [splash, setSplash] = useState(true);

  const fadeSplash = useRef(new Animated.Value(1)).current; 

    useEffect(() => {
      const prepararSplash = async () => {
        setSplash(true);
        await delay(3000);

        Animated.timing(fadeSplash, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setSplash(false);
    });
      };
      prepararSplash();
    }, []);


  const deslizeAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const opacidadeAnim = useRef(new Animated.Value(0)).current;

  const animacao = () => {
    if (!menuAberto) {
      setMenuAberto(true);
      Animated.parallel([
        Animated.timing(deslizeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacidadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(deslizeAnim, {
          toValue: -MENU_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacidadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start(() => setMenuAberto(false));
    }
  };

  const realizarSair = async () => {
    await AsyncStorage.clear();
    setMenuAberto(false);
    setEstaLogado(false);
  };

  const dadosPadrao = { user: "TESTE", nome: 'Bruno', email: "email@hotmail.com", senha: "123", NA: 2, data: "23/03/2026" };

  async function adm(operacao, colecao, dados) {
    setCarregando(true);
    try {
      const response = await api.post('/adm', {
        chave: "chave_para_desencorajar_curiosos_123",
        operacao: operacao,
        tabela: colecao,
        dados: dados
      });
      if (response.data.autenticacao) {
        Alert.alert("Sucesso", `Operação ${operacao} concluída.`);
      }
    } catch (error) {
      const msg = error.response?.data?.dados || "Erro de conexão";
      Alert.alert('Erro', msg);
    } finally {
      setCarregando(false);
    }
  }


if (splash) {
  return (
    <Animated.View style={[styles.splash, { opacity: fadeSplash }]}>
      <StatusBar hidden={true} /> 
      <Image 
        source={require('./assets/splash-icon2.png')} 
        style={styles.splashIMG}
      />
    </Animated.View>
  );
}

  if (estaLogado) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F0F4F8' }}>
        <StatusBar barStyle="light-content" backgroundColor="#107dd6" />

        {/* --- OVERLAY E MENU LATERAL ANIMADO --- */}
        {menuAberto && (
          <View style={StyleSheet.absoluteFill}>
            <Animated.View style={[styles.overlay, { opacity: opacidadeAnim }]}>
              <TouchableOpacity 
                style={{ flex: 1 }} 
                activeOpacity={1} 
                onPress={animacao} 
              />
            </Animated.View>

            <Animated.View style={[styles.sideMenu, { transform: [{ translateX: deslizeAnim }] }]}>
              <View style={styles.sideMenuHeader}>
                <UserCircle color="#107dd6" size={50} />
                <Text style={styles.sideMenuUser}>Admin System</Text>
                <TouchableOpacity onPress={animacao}>
                  <X color="#666" size={24} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.sideMenuItem} onPress={() => Alert.alert("Perfil")}>
                <UserCircle color="#666" size={22} />
                <Text style={styles.sideMenuText}>Meu Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sideMenuItem} onPress={() => Alert.alert("Configurações")}>
                <Settings color="#666" size={22} />
                <Text style={styles.sideMenuText}>Configurações</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.sideMenuItem} onPress={realizarSair}>
                <LogOut color="#d9534f" size={22} />
                <Text style={[styles.sideMenuText, { color: '#d9534f' }]}>Sair</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* --- CONTEÚDO PRINCIPAL --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Painel de Controle</Text>
            <Text style={styles.headerTitle}>Administrador</Text>
          </View>
          <TouchableOpacity style={styles.botaoSairHeader} onPress={realizarSair}>
            <LogOut color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionHeader}>
            <LayoutDashboard size={20} color="#666" />
            <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          </View>

          <View style={styles.grid}>
            <CardMenu titulo="Consultar" cor="#107dd6" icone={<Search color="#fff" size={26} />} onPress={() => adm("consultar", "usuarios", "3")} />
            <CardMenu titulo="Adicionar" cor="#28a745" icone={<PlusCircle color="#fff" size={26} />} onPress={() => adm("add", "usuarios", dadosPadrao)} />
            <CardMenu titulo="Editar" cor="#f39c12" icone={<Edit3 color="#fff" size={26} />} onPress={() => adm("editar", "usuarios", dadosPadrao)} />
            <CardMenu titulo="Deletar" cor="#d9534f" icone={<Trash2 color="#fff" size={26} />} onPress={() => adm("deletar", "usuarios", "3")} />
          </View>

          {carregando && <ActivityIndicator size="large" color="#107dd6" style={{ marginTop: 30 }} />}
        </ScrollView>

        {/* --- BOTÃO FLUTUANTE (FAB) --- */}
        <TouchableOpacity 
          style={[styles.fab, menuAberto && styles.fabAberto]} 
          onPress={animacao}
          activeOpacity={0.9}
        >
          {menuAberto ? (
            <X color="#fff" size={28} />
          ) : (
            <MenuIcon color="#fff" size={28} />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return <Login aoLogar={() => setEstaLogado(true)} />;
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#107dd6',
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  headerSub: { color: '#badcff', fontSize: 14, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  botaoSairHeader: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 15 },
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#888', marginLeft: 10, textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    backgroundColor: '#107dd6',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    zIndex: 10001,
  },
  fabAberto: {
    backgroundColor: '#333',
  },

  // --- ESTILOS DO MENU ---
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9999,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    padding: 25,
    paddingTop: 50,
    elevation: 20,
    zIndex: 10000,
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingBottom: 20,
  },
  sideMenuUser: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, marginLeft: 10 },
  sideMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  sideMenuText: { fontSize: 16, marginLeft: 15, fontWeight: '500', color: '#555' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  splash: { 
    backgroundColor: '#03092d',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
   },
  splashIMG: {
   width: '100%', 
   height: '100%', 
   
  }

});

/*
DEPENDÊNCIAS:

npm install @react-native-async-storage/async-storage lucide-react-native axios

*/
