import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput
} from "react-native";

import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

export default function ToDo(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [toDoValue, setToDoValue] = useState(props.text);

  const { id, deleteToDo, toggleToDo, isCompleted, updateToDo } = props;

  const _toggleComplete = useCallback(event => {
    event.stopPropagation();
    toggleToDo(id);
  });

  const _startEditing = useCallback(
    event => {
      event.stopPropagation();
      setIsEditing(true);
      setToDoValue(toDoValue);
    },
    [isEditing, toDoValue]
  );

  const _finishEditing = useCallback(
    event => {
      event.stopPropagation();
      setIsEditing(false);
      updateToDo(id, toDoValue);
    },
    [isEditing, id, toDoValue]
  );

  const _controlInput = useCallback(
    text => {
      setToDoValue(text);
    },
    [toDoValue]
  );

  const _deleteToDo = useCallback(event => {
    event.stopPropagation();
    deleteToDo(id);
  });

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <TouchableOpacity onPress={_toggleComplete}>
          <View
            style={[
              styles.circle,
              isCompleted ? styles.completedCircle : styles.uncompletedCircle
            ]}
          />
        </TouchableOpacity>
        {isEditing ? (
          <TextInput
            style={[
              styles.text,
              styles.input,
              isCompleted ? styles.completedText : styles.uncompletedText
            ]}
            value={toDoValue}
            multiline={true}
            onChangeText={_controlInput}
            returnKeyType={"done"}
            onBlur={_finishEditing}
          />
        ) : (
          <Text
            style={[
              styles.text,
              isCompleted ? styles.completedText : styles.uncompletedText
            ]}
          >
            {toDoValue}
          </Text>
        )}
      </View>
      {isEditing ? (
        <View style={styles.actions}>
          <TouchableOpacity onPressOut={_finishEditing}>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>✔</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity onPressOut={_startEditing}>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>✏</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPressOut={_deleteToDo}>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>❌</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "red",
    borderWidth: 3,
    marginRight: 20
  },
  completedCircle: {
    borderColor: "#bbb"
  },
  uncompletedCircle: {
    borderColor: "#F23657"
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353839"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2,
    justifyContent: "space-between"
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  input: {
    marginVertical: 15,
    width: width / 2,
    paddingBottom: 5
  }
});

ToDo.propTypes = {
  text: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  deleteToDo: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  toggleToDo: PropTypes.func.isRequired,
  updateToDo: PropTypes.func.isRequired
};
