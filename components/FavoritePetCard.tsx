import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { FavCardProp } from '../types';

export function FavoritePetCard(prop: FavCardProp) {
  return (
    <View style={styles.container}>
      <View style={styles.petPhotoColumn}>
        <View style={styles.petPhoto}>
          <Image source={{ uri: prop.avatar }}
            style={{ width: "100%", aspectRatio: 1 }}
            resizeMode={'cover'} />
          <View style={styles.textContainer}>
            <Text style={{ padding: 15, fontSize: 20, fontWeight: "bold" }}>{prop.name}</Text>
          </View>
          <View style={styles.removeButtonContainer}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => prop.handleRemove(prop.id)}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.petProfileColumn}>
        <View style={styles.label}>
          <Text style={styles.labelText}>Breed:</Text>
          <Text style={styles.attrText}>{prop.breed}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Age:</Text>
          <Text style={styles.attrText}>{prop.age}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Sex:</Text>
          <Text style={styles.attrText}>{prop.sex}</Text>
        </View>
        <View style={styles.label}> 
          <Text style={styles.labelText}>{(prop.sex == 'M' ? 'Neutered' : 'Spayed') + ':'}</Text>
          <Text style={styles.attrText}>{prop.neutered}</Text>
        </View>
        <View style={styles.distanceBox}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Distance:{2} mi</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    justifyContent: 'center',
    flexDirection: "row",
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: "#C4C4C4",
    paddingLeft: 10,
    paddingRight: 10
  },

  petPhotoColumn: {
    paddingVertical: 10,
    width: "40%",
    margin: 5,
    flexDirection: "column",
    backgroundColor: "#C4C4C4",
    // borderWidth: 2
  },

  petProfileColumn: {
    // width: "55%",
    flex: 1,
    alignItems: "stretch",
    flexDirection: "column",
    backgroundColor: "#C4C4C4",
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 10,
    // borderWidth: 2
  },

  petPhoto: {
    borderRadius: 10
  },

  textContainer: {
    backgroundColor: "#818181",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7
  },
  removeButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#C4C4C4",
  },
  removeButton: {
    width: "70%",
    borderRadius: 10,
    backgroundColor: "dodgerblue",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    paddingVertical: 5,
    color: "white",
    fontWeight: "800"
  },

  label: {
    backgroundColor: "#C4C4C4",
    marginBottom: 10
  },

  labelText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#818181"
  },

  attrText: {
    fontSize: 20
  },

  distanceBox: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row",
    backgroundColor: "#C5C5C5"
  },
});
