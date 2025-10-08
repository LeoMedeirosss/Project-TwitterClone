// Component that renders a simple search bar for searching users by username
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SearchBarProps {
  onSearch: (username: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // Local state to store the text typed by the user
  const [searchText, setSearchText] = useState('');

  // Calls the search function passed via props
  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <View style={styles.container}>
      {/* Input field for typing the username */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar por nome de usuário..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch} // Allows pressing Enter to trigger the search
      />

      {/* Button that triggers the search manually */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Pesquisar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
    marginBottom: 15,
    backgroundColor: '#101010',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#202020',
  },
  searchButton: {
    backgroundColor: '#1d9bf0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SearchBar;
