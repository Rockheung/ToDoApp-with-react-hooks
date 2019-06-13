import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage
} from "react-native";

import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";
import ToDo from "./parts/ToDo.js";

const { height, width } = Dimensions.get("window");

export default function App() {
  const [newToDo, setNewToDo] = useState("");
  const [loadToDos, setLoadToDos] = useState(false);
  const [toDos, setToDos] = useState({});

  const _controlNewToDo = useCallback(
    text => {
      setNewToDo(text);
    },
    [newToDo]
  );

  const _loadToDos = async () => {
    try {
      const loadedToDos = await AsyncStorage.getItem("toDos");
      setToDos(JSON.parse(loadedToDos) || {});
      setLoadToDos(true);
    } catch (e) {
      console.log(e);
    }
  };

  const _addToDo = useCallback(() => {
    const ID = uuidv1();
    const _newToDos = {
      [ID]: {
        id: ID,
        isCompleted: false,
        text: newToDo,
        createdAt: Date.now()
      },
      ...toDos
    };

    setToDos(_newToDos);
    setNewToDo("");
  }, [newToDo, toDos]);

  const _deleteToDo = useCallback(
    id => {
      const _toDos = { ...toDos };
      delete _toDos[id];
      setToDos(_toDos);
    },
    [toDos]
  );

  const _toggleToDo = useCallback(
    id => {
      toDos[id].isCompleted = !toDos[id].isCompleted;
      setToDos({ ...toDos });
    },
    [toDos]
  );

  const _updateToDo = useCallback(
    (id, text) => {
      toDos[id].text = text;
      setToDos({ ...toDos });
    },
    [toDos]
  );

  useEffect(() => {
    _loadToDos();
    return () => {};
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("toDos", JSON.stringify(toDos));
    return () => {};
  }, [toDos]);

  if (!loadToDos) {
    return <AppLoading />;
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Hello Todo</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder={"New To Do"}
          value={newToDo}
          onChangeText={_controlNewToDo}
          placeholderTextColor={"#999"}
          returnKeyType={"done"}
          autoCorrect={false}
          onSubmitEditing={_addToDo}
        />
        <ScrollView contentContainerStyle={styles.toDos}>
          {Object.values(toDos).map(toDo => (
            <ToDo
              key={toDo.id}
              toDos={toDos}
              {...toDo}
              deleteToDo={_deleteToDo}
              toggleToDo={_toggleToDo}
              updateToDo={_updateToDo}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F23657",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 25
  },
  toDos: {
    alignItems: "center"
  }
});
