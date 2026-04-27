import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";

type Produto = {
  id: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
};

export default function ListaScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "produtos"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Produto[];

      setProdutos(lista);
    });

    return unsub;
  }, []);

  const salvarProduto = async () => {
    if (!nome || !quantidade || !preco) {
      alert("Preencha todos os campos");
      return;
    }

    if (editandoId) {
      await updateDoc(doc(db, "produtos", editandoId), {
        nomeProduto: nome,
        quantidade: Number(quantidade),
        precoUnitario: Number(preco),
      });
      setEditandoId(null);
    } else {
      await addDoc(collection(db, "produtos"), {
        nomeProduto: nome,
        quantidade: Number(quantidade),
        precoUnitario: Number(preco),
        dataAdicao: new Date()
      });
    }

    setNome("");
    setQuantidade("");
    setPreco("");
  };

  const editarProduto = (p: Produto) => {
    setNome(p.nomeProduto);
    setQuantidade(String(p.quantidade));
    setPreco(String(p.precoUnitario));
    setEditandoId(p.id);
  };

  const excluirProduto = async (id: string) => {
    await deleteDoc(doc(db, "produtos", id));
  };

  const total = produtos.reduce((acc, p) => {
    return acc + p.quantidade * p.precoUnitario;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Minha Lista</Text>

      <TextInput
        placeholder="Produto"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TextInput
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Preço"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={salvarProduto}>
        <Text style={styles.buttonText}>
          {editandoId ? "Atualizar" : "Adicionar"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nomeProduto}</Text>

            <Text>
              {item.quantidade} x R$ {item.precoUnitario}
            </Text>

            <Text style={styles.subtotal}>
              Subtotal: R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editarProduto(item)}>
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => excluirProduto(item.id)}>
                <Text style={styles.delete}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.total}>
        Total: R$ {total.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtotal: {
    marginTop: 5,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  edit: {
    color: "#007bff",
  },
  delete: {
    color: "red",
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
});