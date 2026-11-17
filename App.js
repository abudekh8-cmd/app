import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';

const { width } = Dimensions.get('window');

const MeteorMessageItem = ({ item, isNew, currentUser }) => {
  const isMe = item.sender === currentUser;

  const translateY = useRef(new Animated.Value(isNew ? -350 : 0)).current;
  const translateX = useRef(
    new Animated.Value(isNew ? (isMe ? -width * 0.6 : width * 0.6) : 0)
  ).current;
  const scale = useRef(new Animated.Value(isNew ? 0.5 : 1)).current;
  const tailOpacity = useRef(new Animated.Value(isNew ? 1 : 0)).current;

  useEffect(() => {
    if (isNew) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(550),
          Animated.timing(tailOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isNew]);

  return (
    <Animated.View
      style={[
        styles.meteorWrapper,
        isMe ? styles.myAlign : styles.herAlign,
        {
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.meteorTailGlow,
          isMe ? styles.myTailPosition : styles.herTailPosition,
          { opacity: tailOpacity },
        ]}
      />

      <View style={[styles.meteorBody, isMe ? styles.myMeteorBody : styles.herMeteorBody]}>
        <View style={[styles.meteorHeadGlow, isMe ? styles.myHead : styles.herHead]} />
        <Text style={styles.msgText}>{item.text}</Text>
        <Text style={styles.msgTime}>{item.time}</Text>
      </View>
    </Animated.View>
  );
};

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [currentUser, setCurrentUser] = useState('abdulrahman');
  const [latestMsgId, setLatestMsgId] = useState(null);

  // روابط الصور الشخصية الحقيقية المضافة
  const abdulrahmanPhoto = 'https://i.ibb.co/HMJML3S/image.jpg';
  const nadiaPhoto = 'https://i.ibb.co/ks1rHCvd/image.jpg';

  const [messages, setMessages] = useState([
    { id: '1', text: 'أهلاً بكِ في سماء محادثتنا ✨', sender: 'nadia', time: '12:00 ص' },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.25,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newId = Date.now().toString();
    
    const newMessage = {
      id: newId,
      text: inputText.trim(),
      sender: currentUser,
      time: timeString,
    };

    setLatestMsgId(newId);
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const partnerName = currentUser === 'abdulrahman' ? 'ناديه ✨' : 'عبد الرحمن ✨';
  const partnerPhoto = currentUser === 'abdulrahman' ? nadiaPhoto : abdulrahmanPhoto;

  if (screen === 'welcome') {
    return (
      <SafeAreaView style={styles.welcomeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#070b14" />
        <Text style={styles.welcomeHeader}>عالمنا الخاص 🌌</Text>
        <Text style={styles.subHint}>اختر حسابك للدخول إلى السماء المشتركة:</Text>

        <View style={styles.coupleRow}>
          <TouchableOpacity
            style={[
              styles.avatarBox,
              currentUser === 'abdulrahman' && styles.selectedAvatarBox,
            ]}
            onPress={() => setCurrentUser('abdulrahman')}
          >
            <Image source={{ uri: abdulrahmanPhoto }} style={styles.coupleImage} />
            <Text style={styles.nameLabel}>عبد الرحمن</Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: heartScale }], marginHorizontal: 15 }}>
            <Text style={styles.heartIcon}>❤️</Text>
          </Animated.View>

          <TouchableOpacity
            style={[
              styles.avatarBox,
              currentUser === 'nadia' && styles.selectedAvatarBox,
            ]}
            onPress={() => setCurrentUser('nadia')}
          >
            <Image source={{ uri: nadiaPhoto }} style={styles.coupleImage} />
            <Text style={styles.nameLabel}>\ناديه</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={() => setScreen('chat')}>
          <Text style={styles.startButtonText}>
            الدخول كـ {currentUser === 'abdulrahman' ? 'عبد الرحمن' : 'ناديه'} 🌠
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.chatContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#070b14" />

      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => setScreen('welcome')}>
          <Text style={styles.backBtn}>⬅️</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.chatTitle}>{partnerName}</Text>
          <Text style={styles.chatStatus}>متصل في سماء المحادثة 🛰️</Text>
        </View>

        <Image source={{ uri: partnerPhoto }} style={styles.smallAvatar} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <MeteorMessageItem
            item={item}
            isNew={item.id === latestMsgId}
            currentUser={currentUser}
          />
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder={`أرسل شهاباً إلى ${currentUser === 'abdulrahman' ? 'ناديه' : 'عبد الرحمن'}...`}
          placeholderTextColor="#64748b"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendBtnText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#070b14',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeHeader: {
    color: '#e2e8f0',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHint: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 30,
  },
  coupleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  avatarBox: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarBox: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  coupleImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#f43f5e',
  },
  nameLabel: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  heartIcon: {
    fontSize: 40,
  },
  startButton: {
    backgroundColor: '#f43f5e',
    paddingVertical: 15,
    paddingHorizontal: 36,
    borderRadius: 30,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#070b14',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backBtn: {
    fontSize: 20,
  },
  headerCenter: {
    alignItems: 'center',
  },
  chatTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatStatus: {
    color: '#38bdf8',
    fontSize: 12,
  },
  smallAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#f43f5e',
  },
  messagesList: {
    padding: 16,
    paddingTop: 30,
  },
  meteorWrapper: {
    maxWidth: '80%',
    marginVertical: 8,
    position: 'relative',
  },
  myAlign: {
    alignSelf: 'flex-end',
  },
  herAlign: {
    alignSelf: 'flex-start',
  },
  meteorBody: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  myMeteorBody: {
    backgroundColor: '#1e3a8a',
    borderBottomRightRadius: 4,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  herMeteorBody: {
    backgroundColor: '#3b0764',
    borderBottomLeftRadius: 4,
    borderWidth: 1.5,
    borderColor: '#f472b6',
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  meteorHeadGlow: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    bottom: 4,
  },
  myHead: {
    right: 4,
    backgroundColor: '#bae6fd',
  },
  herHead: {
    left: 4,
    backgroundColor: '#fbcfe8',
  },
  meteorTailGlow: {
    position: 'absolute',
    width: 90,
    height: 18,
    borderRadius: 10,
    top: -14,
  },
  myTailPosition: {
    left: -25,
    backgroundColor: 'rgba(56, 189, 248, 0.35)',
    transform: [{ rotate: '35deg' }],
  },
  herTailPosition: {
    right: -25,
    backgroundColor: 'rgba(244, 114, 182, 0.35)',
    transform: [{ rotate: '-35deg' }],
  },
  msgText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'right',
  },
  msgTime: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  inputRow: {
    flexDirection: 'row-reverse',
    padding: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1e293b',
    color: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    textAlign: 'right',
    marginLeft: 10,
  },
  sendBtn: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendBtnText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 15,
  },
});