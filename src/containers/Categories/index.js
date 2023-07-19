/** @format */

// @flow
/**
 * Created by InspireUI on 19/02/2017.
 */
import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    Animated,
    ScrollView,
    TouchableOpacity,
    TextInput,
    TouchableHighlight,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    Linking,
    FlatList,
} from "react-native";
import { connect } from "react-redux";

import { Images, Config, Constants, withTheme, Languages, Color, Tools } from "@common";
import * as Constants1 from 'expo-constants';
import { toast, BlockTimer } from "@app/Omni";
import {
    Empty,
    LogoSpinner,
    SplitCategories,
    AdMob,
    ColumnCategories,
    SubCategories,
    TouchableScale,
    Spinner
} from "@components";
import Icon from "@expo/vector-icons/FontAwesome";

import styles from "./styles";

import { firebase, firestore } from "../../services/Firebase";
import * as SecureStore from 'expo-secure-store';
import StarRating from 'react-native-star-rating';
import { isEmpty } from "validate.js";
import * as Notifications from 'expo-notifications';
import  { color, not } from "react-native-reanimated";
import moment from "moment";
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

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

class CategoriesScreen extends React.PureComponent {

    _handleNotification = notification => {
        const { onViewNotificationScreen } = this.props;
        onViewNotificationScreen();
    };
    async componentDidMount() {
        const { fetchCategories, fetchOrder, categories, fetchVersionApp, initPromotions, onViewNotificationScreen, getCoupons } = this.props;

        let tem = (await getValueFor("notifications")).toString();
        if (tem === "1") {
            onViewNotificationScreen();
        }
        fetchVersionApp();
        let serverVersion = categories.versionApp.version.split(".");
        let appVersion = Constants1.default.manifest.version.split(".");
        let serverVersionFinal = (new Number(serverVersion[0]) * 100) + (new Number(serverVersion[1]) * 10) + (new Number(serverVersion[2]));
        let appVersionFinal = (new Number(appVersion[0]) * 100) + (new Number(appVersion[1]) * 10) + (new Number(appVersion[2]));
        if (serverVersionFinal > appVersionFinal) {
            this.setState({ modalUpdate: true });
        }

        getCoupons();
        fetchCategories();
        initPromotions();
        let order = (await getValueFor("orderId")).toString();
        let viewSurvey = (await getValueFor("viewSurvey")).toString();
        if (this.props.user.user && order && viewSurvey === "false") {
            fetchOrder(order);
            if (categories.lastOrder.status.toString().toLowerCase().trim() === 'completed') {
                this.setModalVisibleStar(true);
            }
        }
        Notifications.addNotificationResponseReceivedListener(response => {
            onViewNotificationScreen();
        });
    }
    state = {
        scrollY: new Animated.Value(0),
        modalVisible: false,
        text: '',
        isLoading: false,
        modalStar: false,
        starApp: 3,
        starBiker: 3,
        starOrder: 3,
        txtApp: '',
        txtBiker: '',
        txtOrder: '',
        modalUpdate: false,
        modalmenu: false,
        semanSantaModal : true,
        subCategories: []


    };
    setModalMenu(visible) {
        this.setState({ modalmenu: visible });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    setModalVisibleStar(visible) {
        this.setState({ modalStar: visible });
    }

    onStarRatingPress(rating, star) {
        switch (star) {
            case 1: this.setState({ starApp: rating });
                break;
            case 2: this.setState({ starBiker: rating });
                break;
            case 3: this.setState({ starOrder: rating });
                break;
        }
    }

    cancelSurvey = () => {
        this.setModalVisibleStar(false);
        save("viewSurvey", "true");
    }

    cancelUpdateVersion = () => {
        this.setState({ modalUpdate: false });
    } 
     cancelSemanSantaModal  = () => {
        this.setState({ semanSantaModal: false });
    } 



    changeLayout = () => this.props.setActiveLayout(!this.props.selectedLayout);

    componentWillReceiveProps(props) {
        const { error } = props.categories;
        if (error) toast(error);
        Notifications.addNotificationResponseReceivedListener(response => {
            this.props.onViewNotificationScreen();
        });
    }

    renderLayoutButton = () => {
        const hitSlop = { top: 20, right: 20, left: 20, bottom: 20 };
        return (
            <TouchableOpacity
                style={styles.fab}
                onPress={this.changeLayout}
                activeOpacity={1}
                hitSlop={hitSlop}>
                <Icon.Button
                    onPress={this.changeLayout}
                    color="#fff"
                    iconStyle={{ backgroundColor: "transparent", left: 5 }}
                    borderRadius={50}
                    backgroundColor="transparent"
                    name="exchange"
                    size={14}
                />
            </TouchableOpacity>
        );
    };

    onRowClickHandle = (category) => {
        const { setSelectedCategory, onViewCategory } = this.props;
        BlockTimer.execute(() => {
            setSelectedCategory({
                ...category,
                mainCategory: category,
            });
            onViewCategory({ mainCategory: category });
        }, 100);
    };


    getCurrentDate = () => {

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        // You can turn it in to your desired format
        return date + '/' + month + '/' + year;//format: dd/mm/yyyy;
    }
    addComments = () => {

        if (isEmpty(this.state.text)) {

            toast("Ingresa tus comentarios");

        }
        else {
            this.setState({ isLoading: true });
            firestore.collection("surveys").add({

                user: {
                    userId: this.props.user.user.id.toString(),
                    userName: this.props.user.user.username.toString(),
                    email: this.props.user.user.email.toString(),
                    firstName: this.props.user.user.first_name.toString(),
                    lastName: this.props.user.user.last_name.toString(),
                    phone: this.props.user.user.billing.phone.toString()
                },
                text: this.state.text,
                date: this.getCurrentDate()
            })
                .then((ref) => {
                    this.setState({ isLoading: false });
                    this.setState({ modalVisible: false });
                    this.setState({ text: '' });
                    toast("Gracias por tus sugerencias. Te avisaremos cuando tengamos disponible el producto de tu interés.");

                    console.log(ref.id);
                })
                .catch((error, data) => {
                    this.setState({ isLoading: false });
                    Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "addComments" });
                });
        }
    }

    addSurvey = () => {
        const { categories } = this.props;

        this.setState({ isLoading: true });
        firestore.collection("userExperience").add({
            survey: {
                appCalification: this.state.starApp,
                appComments: this.state.txtApp,
                bikerCalification: this.state.starBiker,
                bikerComments: this.state.txtBiker,
                orderCalification: this.state.starOrder,
                orderComments: this.state.txtOrder
            },
            user: {
                userId: this.props.user.user.id.toString(),
                userName: this.props.user.user.username.toString(),
                email: this.props.user.user.email.toString(),
                firstName: this.props.user.user.first_name.toString(),
                lastName: this.props.user.user.last_name.toString(),
                phone: this.props.user.user.billing.phone.toString()
            },
            date: this.getCurrentDate(),
            orderId: categories.lastOrder.id
        })
            .then((ref) => {
                this.setState({ isLoading: false });
                this.setState({ modalStar: false });
                toast("Gracias por tus comentarios.");

                console.log(ref.id);
            })
            .catch((error, data) => {
                this.setState({ isLoading: false });
                Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "addSurvey" });
            });

        this.cancelSurvey();
    }



    openStore = () => {

        this.setState({ modalUpdate: false });

        if (Platform.OS === 'ios') {
            Linking.canOpenURL("https://apps.apple.com/gt/app/devol%C3%A1/id1542410156").then(supported => {
                if (supported) {
                    Linking.openURL("https://apps.apple.com/gt/app/devol%C3%A1/id1542410156");
                } else {
                    console.log("Don't know how to open URI: https://apps.apple.com/gt/app/devol%C3%A1/id15424101560.");
                }
            });
        }
        else {
            Linking.canOpenURL("https://www.devola.gt/descarga").then(supported => {
                if (supported) {
                    Linking.openURL("https://www.devola.gt/descarga");
                } else {
                    console.log("Don't know how to open URI: https://www.devola.gt/descarga");
                }
            });
        }
    }


    onChangeText = (text) => {
        this.setState({ text: text });
        //   this.text1 = text;

    }

    menu = (category) => {
        const { categories } = this.props;


        let subCategories = categories.list.filter(
            (subcategory) => subcategory.parent === category.item.id
        );
        if (!isEmpty(subCategories)) {
            //this.state.subCategories = subCategories;
            this.setState({ subCategories });
            this.setModalMenu(true);
            //   alert(JSON.stringify(this.state.subCategories));

        }
        else {
            this.onRowClickHandle(category.item);
            this.state.subCategories = [];
        }


    }
    formatData = (data, numColumns) => {
        const numberOfFullRows = Math.floor(data.length / numColumns);

        let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
            numberOfElementsLastRow++;
        }

        return data;
    };

    renderRow = (category) => {
        if (category.item.empty && category.item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }

        return (

            <TouchableOpacity
                activeOpacity={1}
                style={[styles.category_conteiner, { flex: 1, flexDirection: 'column', }]}
                onPress={() => this.menu(category)}>
                <View >
                    <Image style={styles.imageThumbnail} source={{ uri: category.item.image.src }} />
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text
                            numberOfLines={2}
                            style={[styles.text_list]}
                        >
                            {category.item.name}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>);
    }//Empieza
    render() {
        const { categories, onViewProductScreen, promotions } = this.props;
        if (this.props.navigation !== undefined && this.props.navigation.state !== undefined
            && this.props.navigation.state.params !== undefined
            && this.props.navigation.state.params.onGoBack !== undefined
            && this.props.navigation.state.params.onGoBack === true) {

            this.props.navigation.state.params.onGoBack = false;
            //alert(JSON.stringify( this.state.subCategories ));
            if (!isEmpty(this.state.subCategories)) {
                this.setModalMenu(true);
            }
        }


        // const {
        //   theme: {
        //     colors: { background },
        //   },
        // } = this.props;

        if (categories.error) {
            return <Empty text={categories.error} />;
        }

        if (categories.isFetching) {
            return <LogoSpinner fullStretch />;
        }

        if (Config.CategoriesLayout == Constants.CategoriesLayout.sideMenu) {
            return (
                <SplitCategories
                    onViewPost={(product) => onViewProductScreen({ product })}
                />
            );
        }

        if (Config.CategoriesLayout == Constants.CategoriesLayout.column) {
            return <ColumnCategories onViewCategory={this.onRowClickHandle} />;
        }

        if (Config.CategoriesLayout == Constants.CategoriesLayout.topMenu) {
            return (
                <SubCategories
                    onViewPost={(product) => onViewProductScreen({ product })}
                />
            );
        }

        let mainCategories = categories.list.filter(
            (category) => category.parent === 0
        );
        // remove duplicate item
        mainCategories = [
            ...new Map(mainCategories.map((item) => [item["id"], item])).values(),
        ];
        let sortCategories = mainCategories.sort((a, b) => a.menu_order - b.menu_order);

        // alert(JSON.stringify(sortCategories))
        var date = new Date();
        date.setDate(date.getDate() + 1);

        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <AnimatedScrollView
                    scrollEventThrottle={1}
                    contentContainerStyle={styles.scrollView}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        { useNativeDriver: true }
                    )}>
                    <View >
                        <Text style={[styles.label2]}>
                            {Languages.labelOrder2}
                        </Text>
                    </View>
                    {typeof categories !== "undefined" &&
                        <FlatList
                            data={this.formatData(sortCategories, 3)}
                            renderItem={this.renderRow}
                            //Setting the number of column
                            numColumns={3}
                            keyExtractor={(item, index) => index}
                            style={[{ marginHorizontal: 12 }]}
                        />
                    }

                    <AdMob />

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalmenu}
                        onRequestClose={() => {
                            this.setModalMenu(false);
                        }}
                        onPressOut={() => { this.setModalMenu(false); }}
                    >
                        <TouchableOpacity style={styles.centeredView} onPressOut={() => { this.setModalMenu(false) }}>

                            <View style={styles.modalViewMenu}>
                                <TouchableOpacity
                                    style={styles.closeButtonMenu}
                                    onPress={() => {
                                        this.setModalMenu(false);
                                    }}>
                                    <Text style={styles.textStyleMenu}>X</Text>
                                </TouchableOpacity>
                                <ScrollView style={styles.containerStyle2}
                                    persistentScrollbar={true}>
                                    {
                                        this.state.subCategories.map((category, index) => {
                                            return (
                                                <View>
                                                    <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                                                        onPress={() => {
                                                            this.setModalMenu(false);
                                                            this.onRowClickHandle(category);
                                                        }}>
                                                        <Text style={[styles.survey]}>{category.name}</Text>
                                                    </TouchableOpacity>
                                                    <View style={{
                                                        flex: 1,
                                                        alignSelf: 'center',
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: "#CED7DD",
                                                        marginTop: 10,
                                                        marginBottom: 10,
                                                        width: 200
                                                    }} />
                                                </View>
                                            )
                                        })}

                                </ScrollView>
                            </View>

                        </TouchableOpacity>
                    </Modal>

                    <TouchableWithoutFeedback onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}

                            onRequestClose={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}
                        >
                            <TouchableOpacity style={styles.centeredView} onPressOut={() => { this.setModalVisible(!this.state.modalVisible); }} >
                                <View style={styles.modalView}>
                                    <View style={styles.modalView2}>
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => {
                                                this.setModalVisible(!this.state.modalVisible);
                                            }}>
                                            <Text style={styles.textStyle}>X</Text>
                                        </TouchableOpacity>
                                        <Image style={[styles.icon, { justifyContent: 'center' }]} source={require("@images/icono_devola.png")} />
                                        <Text style={[styles.survey2]}>{"¿Qué producto te hace falta?"}</Text>
                                        <View style={styles.input}>
                                            <TextInput
                                                style={styles.input2}
                                                multiline={true}
                                                onChangeText={text => this.onChangeText(text)}
                                                value={this.state.text}
                                                placeholder={Languages.TypeSurvey}
                                            />
                                        </View>
                                        <TouchableOpacity style={styles.btnAdd} onPress={this.addComments}>
                                            <Text style={styles.add}>{Languages.sendComment}</Text>
                                        </TouchableOpacity>

                                        {this.state.isLoading ? <Spinner mode="full" color="black" /> : null}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => {
                        this.cancelSurvey();
                    }}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalStar}

                            onRequestClose={() => {
                                this.cancelSurvey();
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View style={styles.modalView2}>
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => {
                                                this.cancelSurvey();
                                            }}>
                                            <Text style={styles.textStyle}>X</Text>
                                        </TouchableOpacity>
                                        <Image style={[styles.icon, { justifyContent: 'center' }]} source={require("@images/icono_devola.png")} />
                                        <Text style={[styles.questionInit, { justifyContent: 'center', color: 'white' }]} >{"Queremos saber qué te ha parecido \n la experiencia Devolá"}</Text>
                                        <ScrollView style={styles.containerStyle2}>
                                            <View style={styles.questionConteiner} >
                                                <Text style={styles.textHeaderQuestion}>{"Servicio de la App"}</Text>
                                                <Text style={styles.textQuestion}>{"Encontraste todo lo que buscabas"}</Text>
                                                <StarRating
                                                    disabled={false}
                                                    emptyStar={'ios-star-outline'}
                                                    fullStar={'ios-star'}
                                                    halfStar={'ios-star-half'}
                                                    iconSet={'Ionicons'}
                                                    maxStars={5}
                                                    rating={this.state.starApp}
                                                    selectedStar={(rating) => this.onStarRatingPress(rating, 1)}
                                                    fullStarColor={'#18EDBF'}
                                                    emptyStarColor={'#18EDBF'}
                                                />
                                                <Text style={[styles.textQuestion, { paddingRight: '35%', marginTop: 15 }]}>{"¿Cómo podemos mejorar?"}</Text>
                                                <TextInput
                                                    style={styles.inputCommentText}

                                                    autoCorrect={false}
                                                    multiline={true}
                                                    value={this.state.txtApp}
                                                    onChangeText={(text) => this.setState({ txtApp: text })}
                                                    placeholder={Languages.placeComment}
                                                    onSubmitEditing={this.submitComment}
                                                />

                                            </View>
                                            <View style={styles.questionConteiner} >
                                                <Text style={styles.textHeaderQuestion}>{"Servicio del motorista"}</Text>
                                                <Text style={styles.textQuestion}>{"El motorista cumplió las normas de sanidad y te dio un trato amable y educado"}</Text>
                                                <StarRating
                                                    disabled={false}
                                                    emptyStar={'ios-star-outline'}
                                                    fullStar={'ios-star'}
                                                    halfStar={'ios-star-half'}
                                                    iconSet={'Ionicons'}
                                                    maxStars={5}
                                                    rating={this.state.starBiker}
                                                    selectedStar={(rating) => this.onStarRatingPress(rating, 2)}
                                                    fullStarColor={'#18EDBF'}
                                                    emptyStarColor={'#18EDBF'}
                                                />
                                                <Text style={[styles.textQuestion, { paddingRight: '35%', marginTop: 15 }]}>{"¿Cómo podemos mejorar?"}</Text>
                                                <TextInput
                                                    style={styles.inputCommentText}

                                                    autoCorrect={false}
                                                    multiline={true}
                                                    value={this.state.txtBiker}
                                                    onChangeText={(text) => this.setState({ txtBiker: text })}
                                                    placeholder={Languages.placeComment}
                                                    onSubmitEditing={this.submitComment}
                                                />
                                            </View>
                                            <View style={styles.questionConteiner} >
                                                <Text style={styles.textHeaderQuestion}>{"Entrega de su pedido"}</Text>
                                                <Text style={styles.textQuestion}>{"Tu pedido llegó exacto y completo"}</Text>
                                                <StarRating
                                                    disabled={false}
                                                    emptyStar={'ios-star-outline'}
                                                    fullStar={'ios-star'}
                                                    halfStar={'ios-star-half'}
                                                    iconSet={'Ionicons'}
                                                    maxStars={5}
                                                    rating={this.state.starOrder}
                                                    selectedStar={(rating) => this.onStarRatingPress(rating, 3)}
                                                    fullStarColor={'#18EDBF'}
                                                    emptyStarColor={'#18EDBF'}
                                                    halfStarColor={'#18EDBF'}
                                                />
                                                <Text style={[styles.textQuestion, { paddingRight: '35%', marginTop: 15 }]}>{"¿Cómo podemos mejorar?"}</Text>
                                                <TextInput
                                                    style={styles.inputCommentText}

                                                    autoCorrect={false}
                                                    multiline={true}
                                                    value={this.state.txtOrder}
                                                    onChangeText={(text) => this.setState({ txtOrder: text })}
                                                    placeholder={Languages.placeComment}
                                                    onSubmitEditing={this.submitComment}
                                                />
                                            </View>

                                            <TouchableOpacity style={styles.btnAdd} onPress={this.addSurvey}>
                                                <Text style={styles.add}>{Languages.sendEvaluation}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.btnCancel} onPress={this.cancelSurvey}>
                                                <Text style={styles.cancel}>{Languages.noThanks}</Text>
                                            </TouchableOpacity>

                                        </ScrollView>





                                        {this.state.isLoading ? <Spinner mode="full" color="black" /> : null}
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </TouchableWithoutFeedback>



                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalUpdate}
                    >
                        <View style={styles.centenedViewVersion}>
                            <View style={styles.modalViewVersion}>
                                <View style={styles.modalViewVersion2}>

                                    <Image style={[styles.icon, { justifyContent: 'center' }]} source={require("@images/icono_devola.png")} />
                                    <Text style={[styles.surveyVersion]}>{"Gracias por descargar Devolá. Procede a actualizar para obtener la última versión y disfrutar la experiencia."}</Text>

                                    <TouchableOpacity style={styles.btnAcceptVersion} onPress={this.openStore} >
                                        <Text style={styles.versionAccept}>{Languages.accept}</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>
                    </Modal> 
                    
                    {this.props.user.user &&
                        <View style={styles.containerStyle, { marginBottom: "15%", paddingTop: "10%" }}>
                            <Text style={[styles.survey]}>{"¿Qué producto te hace falta?"}</Text>
                            <TouchableOpacity style={styles.imageView2} onPress={() => {
                                this.setModalVisible(true);
                            }}>
                                <View style={{ flexDirection: "row", margin: 0, }}>
                                    <View style={[styles.overlay2]}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                </AnimatedScrollView>
                {/*   <Text style ={{color: '#fff'}}> testing</Text>*/}
            </View >
        );
    }//TERMINA
}


const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        netInfo: state.netInfo,
        user: state.user,
        selectedLayout: state.categories.selectedLayout,
        promotions: state.promotions
    };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
    const { netInfo } = stateProps;
    const { dispatch } = dispatchProps;
    const { actions } = require("@redux/CategoryRedux");
    const PromotionsRedux = require("@redux/PromotionsRedux");
    const ProductRedux = require("@redux/ProductRedux");
    return {
        ...ownProps,
        ...stateProps,
        fetchCategories: () => {
            if (!netInfo.isConnected) return toast(Languages.noConnection);
            actions.fetchCategories(dispatch);
        },

        fetchOrder: (orderId) => {
            actions.fetchOrder(dispatch, orderId);
        },
        fetchVersionApp: () => {
            actions.fetchVersionApp(dispatch);
        },
        setActiveLayout: (value) => dispatch(actions.setActiveLayout(value)),
        setSelectedCategory: (category) =>
            dispatch(actions.setSelectedCategory(category)),
        initPromotions: () => {
            PromotionsRedux.actions.initPromotions(dispatch);
        },
        getCoupons: () => {
            ProductRedux.actions.getCoupons(dispatch);
        },

    };
}

export default connect(
    mapStateToProps,
    undefined,
    mergeProps
)(withTheme(CategoriesScreen));
