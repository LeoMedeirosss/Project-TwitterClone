import { View, Text } from "react-native";

export default function Index() {
  return (
    <View className="Conteiner" style={{ flex: 1, alignItems: "center", backgroundColor: "#000" }}>
      <View className="Header" style={{width: '100%', height: 90, justifyContent: 'center', alignItems: 'center', backgroundColor: "#202020" , borderBottomWidth: 1, borderBottomColor: '#444', opacity: 0.7}}>
        <View style={{width: '70%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40}}>
          <View style={{padding: 15,}}>
            <Text style={{color: "#fff", fontWeight: "bold" }}>Para você</Text>
            <View style={{borderBottomWidth: 3, borderBottomColor: '#1d9bf0', width: "105%", alignSelf: "center", borderRadius: 12 }} />
          </View>
          <View style={{padding: 15,}}>
            <Text style={{color: "#fff"}}>Seguindo</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
