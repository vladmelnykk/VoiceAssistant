import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/Features';
import Voice from '@react-native-community/voice';
import {IMessages, chatGptApi} from '../api/apiChatGPT';
import Tts from 'react-native-tts';

const regex = /^https:\/\/[^\s/$.?#].[^\s]*$/;

const HomeScreen = () => {
  const [messages, setMessages] = React.useState<IMessages[]>([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const onSpeechStartHandler = (e: any) => {
    console.log('onSpeechStartHandler', e);
  };

  const onSpeechEndHandler = (e: any) => {
    setIsRecording(false);
    console.log('speechEndHandler');
  };

  const onSpeechErrorHandler = (e: any) => {
    // console.log('onSpeechErrorHandler', e);
  };

  const onSpeechResultsHandler = (data: any) => {
    console.log('onSpeechResultsHandler', data);
    stopRecording(data.value[0]);
  };

  const startRecording = async () => {
    setIsRecording(true);
    Tts.stop();
    setIsSpeaking(false);
    try {
      await Voice.start('');
    } catch (e) {
      console.error('error starting voice recognition', e);
    }
  };

  const stopRecording = async (result?: string) => {
    console.log('stopping recording');

    await Voice.stop();
    setIsRecording(false);
    console.log('stopping voice recognition');
    if (result) fetchResponse(result);
  };

  const fetchResponse = async (result: string) => {
    if (result.trim().length > 0) {
      let newMessages;

      setMessages(prevMessages => {
        newMessages = [...prevMessages, {role: 'user', content: result.trim()}];
        return newMessages;
      });
      updateScrollView();

      setIsLoading(true);
      const response = await chatGptApi(result.trim(), newMessages!);

      if (response.success) {
        setMessages(prevMessages => [
          ...prevMessages,
          {role: 'assistant', content: response.message},
        ]);
        setIsLoading(false);
        updateScrollView();
        startSpeech(response.message);
      } else {
        Alert.alert('Error', response.message);
      }
    }
  };

  const startSpeech = (message: string) => {
    if (!regex.test(message)) {
      setIsSpeaking(true);
      Tts.speak(message, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
        iosVoiceId: 'com.apple.audiotoolbox.piano-keys',
        rate: 0.5,
      });
    }
  };

  const updateScrollView = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  React.useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechError = onSpeechErrorHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => {
      console.log('finish', event);
      setIsSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
    // Tts.setDefaultLanguage('en-US');

    updateScrollView();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const clear = () => {
    setIsLoading(false);
    setMessages([]);
    Tts.stop();
    setIsSpeaking(false);
    setIsRecording(false);
  };
  return (
    <View className="flex-1 bg-white px-5">
      {/* bot icon */}
      <View className="items-center mt-3">
        <Image
          source={require('../assets/images/robot-assistant.png')}
          style={{width: wp(34), height: wp(34)}}
        />
      </View>
      {/* features || messages */}
      {messages.length > 0 ? (
        <View className="space-y-4">
          <Text
            style={{fontSize: wp(5)}}
            className="text-gray-700 font-semibold">
            Assistant
          </Text>
          <View
            style={{height: hp(58)}}
            className="bg-neutral-200 rounded-3xl p-4">
            <ScrollView
              ref={scrollViewRef}
              className="space-y-4"
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never">
              {messages.map((item, index) => {
                if (item.role === 'assistant') {
                  if (regex.test(item.content)) {
                    return (
                      <View
                        key={index}
                        className="bg-emerald-100 p-2 rounded-3xl rounded-tl-none self-start">
                        <Image
                          source={{
                            uri: item.content,
                            width: wp(60),
                            height: wp(60),
                          }}
                          resizeMode="contain"
                          className="rounded-2xl"
                        />
                      </View>
                    );
                  } else {
                    return (
                      <View
                        key={index}
                        style={{maxWidth: wp(70)}}
                        className="bg-emerald-100 p-2 rounded-3xl rounded-tl-none">
                        <Text
                          style={{fontSize: wp(4)}}
                          className="text-gray-700 font-medium">
                          {item.content}
                        </Text>
                      </View>
                    );
                  }
                } else {
                  return (
                    <View
                      key={index}
                      style={{maxWidth: wp(70)}}
                      className="bg-white p-2 rounded-3xl rounded-tr-none self-end">
                      <Text
                        style={{fontSize: wp(4)}}
                        className="text-gray-700 font-medium">
                        {item.content}
                      </Text>
                    </View>
                  );
                }
              })}
            </ScrollView>
          </View>
        </View>
      ) : (
        <Features />
      )}

      {/* stop btn || voice btn || clear btn */}
      <View className="flex-1 items-center justify-center">
        <TouchableOpacity
          onPress={() => {
            isRecording ? stopRecording() : startRecording();
          }}>
          <Image
            source={
              isLoading
                ? require('../assets/images/Circles-menu-.gif')
                : isRecording
                ? require('../assets/images/recording.gif')
                : require('../assets/images/icons-microphone-black.png')
            }
            style={{
              width: isRecording ? hp(10) : hp(5),
              height: isRecording ? hp(10) : hp(5),
            }}
          />
        </TouchableOpacity>
        {messages.length > 0 && (
          <TouchableOpacity
            onPress={clear}
            className="bg-neutral-400 p-2 rounded-3xl absolute right-10">
            <Text className="text-white font-semibold">Clear</Text>
          </TouchableOpacity>
        )}
        {isSpeaking && (
          <TouchableOpacity
            onPress={() => {
              Tts.stop();
              setIsSpeaking(false);
            }}
            className="bg-red-400 p-2 rounded-3xl absolute left-10">
            <Text className="text-white font-semibold">Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
