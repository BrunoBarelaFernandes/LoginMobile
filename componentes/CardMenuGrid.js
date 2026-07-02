import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function CardMenu({ titulo, icone, cor, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: cor }]} 
      onPress={onPress}
      activeOpacity={0.7} 
    >
      <View style={[styles.iconContainer, { backgroundColor: cor }]}>
        {icone}
      </View>
      <Text style={styles.cardTexto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: '48%',
    height: 140,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderLeftWidth: 5,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  cardTexto: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#444',
    textAlign: 'center'
  }
});


/*
DEPENDÊNCIAS:
<View style={styles.grid}>
    <CardMenu
        titulo="Deletar"
        cor="#d9534f"
        icone={<Trash2 color="#fff" size={28} />}
        onPress={() => funcao()}
    />

</View>

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },

});
*/