import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import DragDropEntry, {
  DragItem,
  sortArray,
  updatePositionArrayField,
  TScrollFunctions,
  Positions,
} from "@markmccoid/react-native-drag-and-order";

export type ItemType = {
  id: number | string;
  name: string;
  pos: number;
};

const itemData = [
  { id: "a", name: "Coconut Milk", pos: 0 },
  { id: "b", name: "Lettuce", pos: 1 },
  { id: "c", name: "Walnuts", pos: 2 },
  { id: "d", name: "Chips", pos: 3 },
  { id: "e", name: "Ice Cream", pos: 4 },
  { id: "f", name: "Carrots", pos: 5 },
  { id: "g", name: "Onions", pos: 6 },
  { id: "h", name: "Cheese", pos: 7 },
  { id: "i", name: "Frozen Dinners", pos: 8 },
  { id: "j", name: "Yogurt", pos: 9 },
  { id: "k", name: "Kombucha", pos: 10 },
  { id: "l", name: "Lemons", pos: 11 },
  { id: "m", name: "Bread", pos: 12 },
];

export default function App() {
  // prevNumberOfItems used in useEffect (commented out by default)
  const prevNumberOfItems = React.useRef(0);
  const [newItem, setNewItem] = React.useState("");
  const [items, setItems] = React.useState<ItemType[]>(itemData);
  // add an item to the end of the items array
  const addItem = (itemValue: string) => {
    setItems((prev) => [...prev, { id: prev.length + 1, name: itemValue, pos: prev.length }]);
  };
  // remove item with id passed.  Use the updatePositionArrayField helper to make sure our
  // "pos" key within our ItemType is updated to make the index it lines up with.
  // NOTE: you do not need a position key/field in you item objects.  You may just need
  // the array to have the proper order and if so, the position field is not needed.
  const removeItemById = (id: string | number) =>
    setItems((prev) =>
      updatePositionArrayField<ItemType>(
        prev.filter((item) => item.id !== id),
        "pos"
      )
    );

  // Store the scroll functions for our dragdrop list
  const [scrollFunctions, setScrollFunctions] = React.useState<TScrollFunctions>();
  const reorderFunc = React.useCallback(
    (positions: Positions) => {
      setItems(
        sortArray<ItemType>(positions, items, {
          positionField: "pos",
          idField: "id",
        }) as ItemType[]
      );
    },
    [items]
  );
  //************************************************* */
  // You can use an useEffect hook to scroll to start/end
  // based on how many items in your list.
  // React.useEffect(() => {
  //   if (!scrollFunctions) return;
  //   if (items.length <= 5) {
  //     scrollFunctions.scrollToEnd();
  //   }
  // }, [items.length]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>D & D Grocery List </Text>
      <View style={styles.separator} />
      <DragDropEntry
        scrollStyles={{ width: "100%", height: "30%", borderWidth: 1, borderColor: "#aaa" }}
        updatePositions={reorderFunc}
        getScrollFunctions={(scrollFuncs: TScrollFunctions) => setScrollFunctions(scrollFuncs)}
        itemHeight={50}
        handlePosition="left"
        // handle={AltHandle}
        enableDragIndicator={true}
        dragIndicatorConfig={{
          translateXDistance: 100,
          indicatorBackgroundColor: "#abcabcaa",
          indicatorBorderRadius: 20,
        }}
        // dragIndicator={testDragIndicator}
      >
        {items.map((item, idx) => {
          return (
            <DragItem
              key={item.id}
              name={item.name}
              id={item.id}
              itemHeight={50}
              onRemoveItem={() => {
                removeItemById(item.id);
              }}
            />
          );
        })}
      </DragDropEntry>
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <TextInput
          style={{
            width: 200,
            // height: 30,
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            margin: 5,
            marginTop: 10,
            fontSize: 20,
          }}
          placeholder="Enter New item"
          value={newItem}
          onChangeText={setNewItem}
          // onSubmitEditing={(e) => addItem(e.nativeEvent.text)}
        />
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            margin: 5,
            backgroundColor: "#0084fa",
            borderRadius: 10,
          }}
          onPress={() => {
            addItem(newItem);
            setNewItem("");
          }}
        >
          <Text style={{ color: "white", fontSize: 19 }}>Add New Item</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            margin: 5,
            backgroundColor: "#0084fa",

            borderRadius: 10,
          }}
          onPress={() => {
            scrollFunctions?.scrollToStart();
          }}
        >
          <Text style={{ color: "white", fontSize: 19 }}>Scroll To Start</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{ width: "70%", height: "40%", borderWidth: 1, padding: 5, marginBottom: 10 }}
      >
        <ScrollView
          stickyHeaderIndices={[0]}
          style={{ marginHorizontal: 10, paddingHorizontal: 10 }}
        >
          <View key={0} style={{ borderBottomColor: "#777", borderBottomWidth: 1 }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 16 }}>Item</Text>
              <Text style={{ fontSize: 16 }}>Pos</Text>
            </View>
          </View>
          {items.map((item) => (
            <View
              key={item.id}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 16 }}>{`${item.name}`}</Text>
              <Text style={{ fontSize: 16 }}>{`${item.pos}`}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    // borderColor: "red",
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: "80%",
  },
});
