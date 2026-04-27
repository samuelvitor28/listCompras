import { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ListaScreen() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "produtos"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(lista);
    });

    return unsub;
  }, []);

  const adicionarProduto = async () => {
    await addDoc(collection(db, "produtos"), {
      nomeProduto: nome,
      quantidade: Number(quantidade),
      precoUnitario: Number(preco),
      dataAdicao: new Date()
    });

    setNome("");
    setQuantidade("");
    setPreco("");
  };

  const total = produtos.reduce((acc, p) => {
    return acc + p.quantidade * p.precoUnitario;
  }, 0);

  return (
    <View>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} />
      <TextInput placeholder="Preço" value={preco} onChangeText={setPreco} />

      <Button title="Adicionar" onPress={adicionarProduto} />

      {produtos.map(p => (
        <Text key={p.id}>
          {p.nomeProduto} - {p.quantidade} x {p.precoUnitario}
        </Text>
      ))}

      <Text>Total: R$ {total.toFixed(2)}</Text>
    </View>
  );
}