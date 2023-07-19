/** @format */
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React from 'react';
import CustomAPI from "@services/CustomAPI";
import { Font } from "@expo";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";

import store from "@store/configureStore";
import RootRouter from "./src/Router";
import "./ReactotronConfig";
import { requestTrackingPermissionsAsync, getTrackingPermissionsAsync } from 'expo-tracking-transparency';

import * as SecureStore from 'expo-secure-store';
import ReactPixel from 'react-facebook-pixel';

import Axios from "axios"
import { sha256 } from 'js-sha256'
import { Facebook } from "@expo";
const pixel_id = '1047446912673787';

const PixelApi = Axios.create({
    baseURL: `https://graph.facebook.com/v9.0/${pixel_id}/events`
});


function pixelSaveEvent(email, event) {
  //alert("inicio")
  return new Promise((resolve, reject) => {

      const content_name = event 
      const em = sha256(email) //ENCRYPTS THE EMAIL

      const access_token = 'EAASZC9kZBwFNoBANTZAOTeLzVFX2ft5yNuc708f1qe8OUmZAXGqW7gnIiVGeBixmfuGAXPOWZB6sQUqdcCV4DPWGLftn3Lq8Ua7ci3kc2o28MnZBigJavWZBZBRpShzyVz2olJwbfsyxRlCdZAjZCBekFBZAApZAgPN9Uh8ss2ZBvThBzfp7h4KI0LZCArEEp9AbwQlkbnUAC8VMmJ1qVWzbScHJoNPvKZCJJGJmu0pKqYaOleDldmJsckFoNq5paT8A9V04S0ZD' //CAUTION: YOU MIGHT WANT TO HIDE IT
      const event_name = "testingapp" //OR ANY EVENT YOU WANT
      const event_time = new Date().getTime() / 1000;//DATE IN TIMESTAMP

      const data = [{
          event_name,
          event_time,
          user_data: {
              em //THE ENCRYPTED EMAIL IS SENT HERE
          },
          custom_data: {
              currency:"Q",
              value: "200" //THE CUSTOM EVENT NAME IS SENT HERE
          }
      }]

      const objToSend = {
          data,
          access_token //THE ACCESS TOKEN IS SENT HERE
      }

      PixelApi.post('', objToSend).then(() => {
        alert("SE FUE");
          return resolve()
      }).catch(err => {
        alert("ERROR "+ err);
          return reject(err)
      });
      
  })
}


async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}


function cacheFonts(fonts) {
  return fonts.map((font) => Font.loadAsync(font));
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {

      console.log("no se dieron permisos PUSH");
    }
    token = await Notifications.getExpoPushTokenAsync();

    token = (await Notifications.getExpoPushTokenAsync()).data;

  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}


async function registerTrackingTransparency() {
  const { granted } = await getTrackingPermissionsAsync();
  if (granted) {
    // Your app is authorized to track the user or their device
  }
  else {
    const { status } = await requestTrackingPermissionsAsync();
    if (status === 'granted') {
      console.log('Yay! I have user permission to track data');
    }
    else {
      console.log('No se otorgaron permisos');
    }
  }
}
export default class App extends React.Component {
  isNotificacion = "0";
  loadAssets = async () => {
    const fontAssets = cacheFonts([
      { Mulish: require("@assets/fonts/Mulish-Regular.ttf") },
      { MulishBold: require("@assets/fonts/Mulish-Bold.ttf") },
      { Futura: require("@assets/fonts/Futura-Regular.ttf") },
      { FuturaBold: require("@assets/fonts/Futura-Bold.ttf") },

      { OpenSans: require("@assets/fonts/OpenSans-Regular.ttf") },
      { Baloo: require("@assets/fonts/Baloo-Regular.ttf") },

      { Entypo: require("@expo/vector-icons/fonts/Entypo.ttf") },
      {
        "Material Icons": require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
      },
      {
        MaterialCommunityIcons: require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
      },
      {
        "Material Design Icons": require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
      },
      { FontAwesome: require("@expo/vector-icons/fonts/FontAwesome.ttf") },
      {
        "simple-line-icons": require("@expo/vector-icons/fonts/SimpleLineIcons.ttf"),
      },
      { Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf") },
    ]);

    // const imageAssets = cacheImages([
    //   Images.icons.iconCard,
    //   Images.icons.iconColumn,
    //   Images.icons.iconLeft,
    //   Images.icons.iconRight,
    //   Images.icons.iconThree,
    //   Images.icons.iconAdvance,
    //   Images.icons.iconHorizal,
    //   Images.icons.back,
    //   Images.icons.home,
    //   Images.IconSwitch,
    //   Images.IconFilter,
    //   Images.IconList,
    //   Images.IconGrid,
    //   Images.IconCard,
    //   Images.IconSearch,
    //   Images.IconHome,
    //   Images.IconCategory,
    //   Images.IconHeart,
    //   Images.IconOrder,
    //   Images.IconCart,
    // ]);

    await Promise.all([...fontAssets]);
  };


  async componentDidMount() {
    registerTrackingTransparency().then(() => {
      console.log("se realiza tracking;")
    });

    this.loadAssets();

    registerForPushNotificationsAsync().then(token => {
      CustomAPI.setTokenNotification({ token: token }, (response) => {
        console.log("Dispositivo registrado con exito: " + token);
      });
    });
    save("notifications", this.isNotificacion );

    Notifications.addNotificationResponseReceivedListener(response => {
      this.isNotificacion = "1";
      save("notifications", "1" );
    });
    let access_token = 'EAASZC9kZBwFNoBAIbhWVptEgnItKS0R0tDnvNfvSSVPcaBv8ZCIOYxLMGZBYaXoZCnZCxgZBok1AOJbzvz8ZBuomSLDJ7c02ZChC1H7JMs45wpv2GX0T4e6jOWDzSQUNr0OBgil1BCfba1mkXrEMzXF23XjA503QAUVva2ka0kRgyVb8fIfx3V2rjhLZBrSZBvBpssZD'; //CAUTION: YOU MIGHT WANT TO HIDE IT
    let event_name = "apptestingcart" //OR ANY EVENT YOU WANT
    let event_time =Math.round( new Date().getTime() / 1000);//DATE IN TIMESTAMP
    let em = sha256("desarrollo1@devola.gt") //ENCRYPTS THE EMAIL
    
    let data = [{
        event_name,
        event_time,
        action_source: "email",
        user_data: {
            em //THE ENCRYPTED EMAIL IS SENT HERE
        },
        custom_data: {
            currency:"Q",
            value: "200" //THE CUSTOM EVENT NAME IS SENT HERE
        }
    }];
    const objToSend = {
      data,
      access_token //THE ACCESS TOKEN IS SENT HERE
  };
    CustomAPI.sendDataPixelFacebook(objToSend, (result) => {
  //  alert(JSON.stringify(result));
    });

  
  }


  render() {
    const persistor = persistStore(store);
    return (
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
          <RootRouter
            isNotificacion={this.isNotificacion}
            onNavigationStateChange={async (prevState, currentState, action) => { console.log('Page'); }} />
        </PersistGate>
      </Provider>
    );
  }
}

