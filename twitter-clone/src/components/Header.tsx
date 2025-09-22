//Component that renders the header (tabs).
//Used in the feed and profile.
import { Animated, View, Text, StyleSheet} from 'react-native';

const HEADER_HEIGHT = 90;

export default function Header({ scrollY }: { scrollY: Animated.Value }) {
  const opacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.header, { opacity }]}> 
      <View style={styles.tabsContainer}>
        <View style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Para você</Text>
          <View style={styles.tabIndicator} />
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>Seguindo</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  tabsContainer: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  tab: {
    padding: 15,
  },
  tabActive: {
    padding: 15,
  },
  tabText: {
    color: '#fff',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabIndicator: {
    borderBottomWidth: 3,
    borderBottomColor: '#1d9bf0',
    width: '105%',
    alignSelf: 'center',
    borderRadius: 12,
  },
});
