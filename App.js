import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput,
  StyleSheet, 
  Keyboard,
  FlatList, 
  TouchableOpacity, // Importante per i bordi dello schermo
  Platform,     // Per gestire differenze iOS/Android
  KeyboardAvoidingView // Per non far coprire l'input dalla tastiera
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus } from 'lucide-react-native';

export default function App() {

  const [shoppingList, setShoppingList] = useState([]);
  const [inputUser, setInputUser] = useState("");
  
  const addElement = () => {
    // Trim rimuove gli spazi vuoti prima e dopo
    if(!inputUser || !inputUser.trim()){
      return;
    }

    // Best Practice: Variabili const/let (non globali)
    // Controllo Case-Insensitive (Banana = banana)
    const alreadyExists = shoppingList.some(
      e => e.name.toLowerCase() === inputUser.trim().toLowerCase()
    );

    if (alreadyExists) {
      alert("Hai già inserito questo prodotto!");
      return;
    }

    const ids = shoppingList.map(e => e.id);
    const maxId = shoppingList.length > 0 ? Math.max(...ids) : 0;

    setShoppingList(prev => [
      ...prev,
      {
        id: maxId + 1,
        name: inputUser.trim(),
      }
    ]);
    
    setInputUser("");
    Keyboard.dismiss();
  }

  const removeElement = (id)=> {
    const cleanedShoppintList = shoppingList.filter(e=> e.id !== id);
    setShoppingList(cleanedShoppintList);
  }

 return (
   <SafeAreaProvider>
   <SafeAreaView style={styles.container}>
     <KeyboardAvoidingView 
       behavior={Platform.OS === "ios" ? "padding" : "height"}
       style={styles.keyboardView}
     >
       
       <Text style={styles.title}>Lista della Spesa 🛒</Text>

       <View style={styles.listContainer}>
         {/* Usiamo ListEmptyComponent nativo della FlatList invece del ternario */}
         <FlatList
            data={shoppingList}
            // Importante: le chiavi devono essere stringhe per evitare warning
            keyExtractor={(item) => item.id.toString()} 
            renderItem={({item}) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>• {item.name}</Text>
              <TouchableOpacity style={styles.buttonDelete} onPress={() => removeElement(item.id)}>
   <Trash2 color="#FFF" size={18} />
</TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nessun prodotto... inizia a scrivere!</Text>
              </View>
            }
         />
       </View>

       {/* Area Input fissa in basso */}
       <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            value={inputUser}
            placeholder="Es. Banane" 
            placeholderTextColor="#999"
            onChangeText={(newText) => setInputUser(newText)}
          />
          <TouchableOpacity style={styles.buttonAdd} onPress={addElement}>
            <Plus color="#FFF" size={30} />
          </TouchableOpacity>
       </View>

     </KeyboardAvoidingView>
   </SafeAreaView>
   </SafeAreaProvider>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Grigio chiaro standard iOS
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  keyboardView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    flex: 1, // Occupa tutto lo spazio disponibile tranne input e titolo
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    
    // --- MODIFICHE QUI ---
    flexDirection: 'row',       // 1. Mette gli elementi in riga orizzontale
    justifyContent: 'space-between', // 2. Spinge testo a sx e bottone a dx
    alignItems: 'center',       // 3. Centra verticalmente (la X non sarà più in alto)
    // ---------------------

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  cardText: {
    fontSize: 18,
    color: '#333',
    flex: 1, // IMPORTANTE: Se il testo è lunghissimo, non spinge fuori la X, ma va a capo lui
    marginRight: 10, // Un po' di aria dalla X
  },

  // ... input styles ...

  buttonDelete: {
    width: 30,
    height: 30,
    backgroundColor: '#F54927',
    borderRadius: 15, // Metà di 30 per cerchio perfetto
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },

  // Creiamo uno stile specifico per la X, separato dal "+"
  deleteText: {
    color: '#FFF',
    fontSize: 16, // Più piccolo per stare nel cerchio 30px
    fontWeight: 'bold',
    // Rimuoviamo il marginTop negativo che dava fastidio
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFF', // Sfondo bianco per l'area input
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 20,
    fontSize: 16,
    marginRight: 10,
    height: 50,
  },
  buttonAdd: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2, // Piccolo fix ottico per centrare il "+"
  }
});