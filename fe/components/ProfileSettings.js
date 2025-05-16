import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    country: "",
    age: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    // Display success message and hide after 2 seconds
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
    // onSave(profile);
    // profile.name = ;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile Settings</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>
      </View>

      <View style={styles.form}>
        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your name"
            placeholderTextColor="#666"
          />
        </View>

        {/* Gender Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={profile.gender}
              onValueChange={(value) =>
                setProfile({ ...profile, gender: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {/* Country Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Country of Residence</Text>
          <TextInput
            style={styles.input}
            value={profile.country}
            onChangeText={(text) => setProfile({ ...profile, country: text })}
            placeholder="Enter your country"
            placeholderTextColor="#666"
          />
        </View>

        {/* Age Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={profile.age}
            onChangeText={(text) => setProfile({ ...profile, age: text })}
            placeholder="Enter your age"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
        {showSuccess && (
          <Text
            style={[
              styles.successMessage,
              { marginTop: 16, textAlign: "center" },
            ]}
          >
            Profile saved successfully
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EB",
  },
  header: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8D5C4",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8B4513",
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C1810",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#2C1810",
    borderWidth: 1,
    borderColor: "#E8D5C4",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8D5C4",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#2C1810",
  },
  saveButton: {
    backgroundColor: "#2C1810",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileSettings;
