/** @format */

import Images from "./Images";
import Constants from "./Constants";
import Icons from "./Icons";
import Languages from "./Languages";

// /* Default config */
// const consumerKey = "ck_81d40e65d44d85e7434ce8d7f1ae5e7a84c55758";
// const consumerSecret = "cs_b2535cf79f945fd6e6363aa73613968c99a143cf";
// const url = "https://demo.mstore.io/"

/* Devola AWS config 
const consumerKey = "ck_974d5b0b4037bd59bff4ff736aa3e38755e3a297";
const consumerSecret = "cs_d8e7e97f0ef8d7fac418a2409b376d46876f9d70";
const url = "https://www.devola-api.com/";*/

/*Conexion wordpress testing */

const consumerKey = "ck_5a4227124c91f7b1da9b558615361c438bd7826c";
const consumerSecret = "cs_37ae32dc66c7af233a560abb90f8d178c93ae168";
const url = "https://qa.devola-api.com";


export default {
  /**
   * Step 1: change to your website URL and the wooCommerce API consumeKey
   */
  WooCommerce: {
    url: url,
    consumerKey,
    consumerSecret,
  },

  /**
     Step 2: Setting Product Images
     - ProductSize: Explode the guide from: update the product display size: https://mstore.gitbooks.io/mstore-manual/content/chapter5.html
     The default config for ProductSize is disable due to some problem config for most of users.
     If you have success config it from the Wordpress site, please enable to speed up the app performance
     - HorizonLayout: Change the HomePage horizontal layout - https://mstore.gitbooks.io/mstore-manual/content/chapter6.html
       Update Oct 06 2018: add new type of categories
       NOTE: name is define value --> change field in Language.js
       Moved to AppConfig.json
     */
  ProductSize: {
    enable: false,
  },

  HomeCategories: [
    {
      category: 18,
      image: require("@images/categories_icon/ic_shorts.png"),
      colors: ["#4facfe", "#00f2fe"],
      label: "Men",
    },
    {
      category: 21,
      image: require("@images/categories_icon/ic_tshirt.png"),
      colors: ["#43e97b", "#38f9d7"],
      label: "T-Shirts",
    },
    {
      category: 208,
      image: require("@images/categories_icon/ic_panties.png"),
      colors: ["#fa709a", "#fee140"],
      label: "Clothing",
    },
    {
      category: 26,
      image: require("@images/categories_icon/ic_dress.png"),
      colors: ["#7F00FF", "#E100FF"],
      label: "Dresses",
    },
    {
      category: 24,
      image: require("@images/categories_icon/ic_glasses.png"),
      colors: ["#30cfd0", "#330867"],
      label: "Bags",
    },
  ],
  HomeCategories_AR: [
    {
      category: 18,
      image: require("@images/categories_icon/ic_shorts.png"),
      colors: ["#4facfe", "#00f2fe"],
      label: "لكن",
    },
    {
      category: 21,
      image: require("@images/categories_icon/ic_tshirt.png"),
      colors: ["#43e97b", "#38f9d7"],
      label: "تي شيرت",
    },
    {
      category: 208,
      image: require("@images/categories_icon/ic_panties.png"),
      colors: ["#fa709a", "#fee140"],
      label: "ملابس",
    },
    {
      category: 26,
      image: require("@images/categories_icon/ic_dress.png"),
      colors: ["#7F00FF", "#E100FF"],
      label: "فساتين",
    },
    {
      category: 24,
      image: require("@images/categories_icon/ic_glasses.png"),
      colors: ["#30cfd0", "#330867"],
      label: "أكياس",
    },
  ],
  /**
     step 3: Config image for the Payment Gateway
     Notes:
     - Only the image list here will be shown on the app but it should match with the key id from the WooCommerce Website config
     - It's flexible way to control list of your payment as well
     Ex. if you would like to show only cod then just put one cod image in the list
     * */
  Payments: {
    cod: require("@images/payment_logo/cash_on_delivery.png"),
    paypal: require("@images/payment_logo/PayPal.png"),
    stripe: require("@images/payment_logo/stripe.png"),
    //  cybsawm: require("@images/payment_logo/visa_mc.png"),

  },

  /**
     Step 4: Advance config:
     - showShipping: option to show the list of shipping method
     - showStatusBar: option to show the status bar, it always show iPhoneX
     - LogoImage: The header logo
     - LogoWithText: The Logo use for sign up form
     - LogoLoading: The loading icon logo
     - appFacebookId: The app facebook ID, use for Facebook login
     - CustomPages: Update the custom page which can be shown from the left side bar (Components/Drawer/index.js)
     - WebPages: This could be the id of your blog post or the full URL which point to any Webpage (responsive mobile is required on the web page)
     - intro: The on boarding intro slider for your app
     - menu: config for left menu side items (isMultiChild: This is new feature from 3.4.5 that show the sub products categories)
     * */
  shipping: {
    visible: true,
    zoneId: 3, // depend on your woocommerce
    time: {
      flat_rate: "1 - 4 Days",
    },
  },
  MinimumOrderAmount: 60,
  showStatusBar: true,
  LogoImage: require("@images/devola_blue.png"),
  LogoWithText: require("@images/devola_blue.png"),
  LogoLoading: require("@images/icono_devola.png"),

  showAdmobAds: false,
  AdMob: {
    deviceID: "",
    rewarded: "",
    interstitial: "",
    banner: "",
  },
  appFacebookId: "1336964526642394",
  CustomPages: { contact_id: 10941 },
  WebPages: { marketing: "http://devola.gt" },

  intro: [
    {
      key: "page1",
      title: "BIENVENIDO A DEVOLÁ",
      text: "Llevamos lo que tu hogar necesita, tanto en alimentos como en higiene.\nA continuación te daremos información valiosa para que tengas una linda experiencia.\n\n ¡COMIENZA DEVOLÁ!",
      icon: "ios-basket",
      colors: ["#2800ED", "#2800ED"],
      image: require("@images/onBording/devola.png")
    },
    {
      key: "page6",
      title: "TU OPINIÓN ES LO MÁS VALIOSO",
      text: "Si no encontraste algún producto, por favor haznos saber.\nCada semana integraremos nuevos productos.",
      icon: "ios-basket",
      colors: ["#2800ED", "#2800ED"],
      image: require("@images/onBording/check.png")
    },
    {
      key: "page2",
      title: "CÓMO COMPRAR",
      text: "Busca tus productos en nuestras categorías, añadelos al carrito y confirma tu entrega y pago.",
      icon: "ios-card",
      colors: ["#2800ED", "#2800ED"],
      image: require("@images/onBording/phone.png")
    },
    {
      key: "page3",
      title: "PAGA CON CONFIANZA",
      text: "Puedes utilizar tu tarjeta de débito y/o crédito para hacer tus compras de forma segura o puedes pagar en efectivo contra entrega.",
      icon: "ios-home",
      colors: ["#2800ED", "#2800ED"],
      image: require("@images/onBording/credit.png")
    },
    {
      key: "page4",
      title: "¡RECIBE TUS PEDIDOS Y RELÁJATE DEVOLÁ!",
      text: "Te enviaremos confirmación de tu pedido para recibirlo en un lapso de 24 horas.",
      icon: "ios-home",
      colors: ["#2800ED", "#2800ED"],
      image: require("@images/onBording/delivery.png")
    },
    {
      key: "page5",
      title: "REGISTRA TUS DATOS",
      text: "Puedes comenzar con registrar tus datos o hacerlo en el momento que desees.",
      icon: "ios-home",
      colors: ["#2800ED", "#2800ED"],
      image: require("@images/onBording/user.png")
    },
  ],

  /**
   * Config For Left Menu Side Drawer
   * @param goToScreen 3 Params (routeName, params, isReset = false)
   * BUG: Language can not change when set default value in Config.js ==> pass string to change Languages
   */
  menu: {
    // has child categories
    isMultiChild: true,
    // Unlogged
    listMenuUnlogged: [
      {
        text: "Login",
        routeName: "LoginScreen",
        params: {
          isLogout: false,
        },
        icon: Icons.MaterialCommunityIcons.SignIn,
      },
    ],
    // user logged in
    listMenuLogged: [
      {
        text: "Logout",
        routeName: "LoginScreen",
        params: {
          isLogout: true,
        },
        icon: Icons.MaterialCommunityIcons.SignOut,
      },
    ],
    // Default List
    listMenu: [
      {
        text: "Shop",
        routeName: "Home",
        icon: Icons.MaterialCommunityIcons.Home,
      },
      {
        text: "News",
        routeName: "NewsScreen",
        icon: Icons.MaterialCommunityIcons.News,
      },
      {
        text: "contactus",
        routeName: "CustomPage",
        params: {
          id: 10941,
          title: "contactus",
        },
        icon: Icons.MaterialCommunityIcons.Pin,
      },
      {
        text: "About",
        routeName: "CustomPage",
        params: {
          url: "http://inspireui.com/about/",
        },
        icon: Icons.MaterialCommunityIcons.Email,
      },
    ],
  },

  // define menu for profile tab
  ProfileSettings: [
    // {
    //   label: "WishList",
    //   routeName: "WishListScreen",
    // },
    {
      label: "MyOrder",
      routeName: "MyOrders",
    },
    {
      label: "MyCards",
      routeName: "MyCards",
    },
    {
      label: "Address",
      routeName: "Address",
    },
    // {
    //   label: "Currency",
    //   isActionSheet: true,
    // },
    // only support mstore pro
    // {
    //   label: "Languages",
    //   routeName: "SettingScreen",
    // },
    // {
    //   label: "PushNotification",
    // },
    // {
    //   label: "DarkTheme",
    // },
    {
      label: "contactus",
      routeName: "CustomPage",
      params: {
        id: 10941,
        title: "contactus",
        label: Languages.ContactUs,
        url: "https://www.devola.gt/contactanos",
      },
    },
   {
      label: "Privacy",
      routeName: "CustomPage",
      params: {
        label: Languages.Privacy,
        url: "https://www.devola.gt/privacidad",
      },
    },
    {
      label: "termCondition",
      routeName: "CustomPage",
      params: {
        label: Languages.termCondition,
        url: "https://www.devola.gt/terminiosycondiciones",
      },
    },
    {
      label: "About",
      routeName: "CustomPage",
      params: {
        label: Languages.About,
        url: "https://www.devola.gt/about",
      },
    },
    {
      label: "faqs",
      routeName: "CustomPage",
      params: {
        label: Languages.faqs,
        url: "https://www.devola.gt/faqs",
      },
    },
  ],

  // Homepage Layout setting
  layouts: [
    {
      layout: Constants.Layout.card,
      image: Images.icons.iconCard,
      text: "cardView",
    },
    {
      layout: Constants.Layout.simple,
      image: Images.icons.iconRight,
      text: "simpleView",
    },
    {
      layout: Constants.Layout.twoColumn,
      image: Images.icons.iconColumn,
      text: "twoColumnView",
    },
    {
      layout: Constants.Layout.threeColumn,
      image: Images.icons.iconThree,
      text: "threeColumnView",
    },
    {
      layout: Constants.Layout.horizon,
      image: Images.icons.iconHorizal,
      text: "horizontal",
    },
    {
      layout: Constants.Layout.advance,
      image: Images.icons.iconAdvance,
      text: "advanceView",
    },
  ],

  // Default theme loading, this could able to change from the user profile (reserve feature)
  Theme: {
    isDark: false,
  },

  // new list category design
  CategoriesLayout: Constants.CategoriesLayout.card,

  // WARNING: Currently when you change DefaultCurrency, please uninstall your app and reinstall again. The redux saved store.
  DefaultCurrency: {
    symbol: "Q",
    name: "Quetzal",
    code: "GTQ",
    name_plural: "Quetzales",
    decimal: ".",
    thousand: ",",
    precision: 2,
    format: "%s%v", // %s is the symbol and %v is the value
  },

  DefaultCountry: {
    code: "gtm",
    RTL: false,
    language: "Español",
    countryCode: "GTM",
    hideCountryList: true, // when this option is try we will hide the country list from the checkout page, default select by the above 'countryCode'
  },

  /**
   * Config notification onesignal, only effect for the Pro version
   */
  OneSignal: {
    appId: "",
  },
  /**
   * Login required
   */
  Login: {
    RequiredLogin: false, // required before using the app
    AnonymousCheckout: false, // required before checkout or checkout anonymous
  },

  Layout: {
    HideHomeLogo: true,
    HideLayoutModal: false,
  },

  Affiliate: { enable: false },

  EnableOnePageCheckout: false,

  NativeOnePageCheckout: true,

  // using url from server to load AppConfig.json
  HomeCaching: {
    url: `https://testing.devola.info/wp-json/wc/v2/flutter/cache?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`, // can change url to load another server
    enable: true, // disable load from server, and start load in local in `common/AppConfig.json`
  },
  lcepsKey: '60ae6e6d44e29'
};
