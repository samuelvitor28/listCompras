import { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");

  const recuperar = async () => {
    await sendPasswordResetEmail(auth, email);
    alert("Email enviado!");
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <Button title="Recuperar senha" onPress={recuperar} />
    </View>
  );
}