/** @format */

import React, { PureComponent } from "react";

import { Images, Color, Styles, withTheme, Languages } from "@common";
import { Notifications } from "@containers";
import { Back, RightIcon } from "./IconNav";

@withTheme
export default class NotificationsScreen extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        const headerStyle = navigation.getParam(
            "headerStyle",
            Styles.Common.toolbar()
        );
        const dark = navigation.getParam("dark", false);

        return {
            headerTitle: Languages.Notifications,
            headerLeft: Back(navigation, null, dark),
            headerRight: RightIcon(Images.IconDevola, null),

            headerTintColor: Color.headerTintColor,
            headerStyle,
            headerTitleStyle: Styles.Common.headerStyle,
        };
    };

    UNSAFE_componentWillMount() {
        const {
            theme: {
                colors: { background },
                dark,
            },
        } = this.props;

        this.props.navigation.setParams({
            headerStyle: Styles.Common.toolbar(background, dark),
            dark,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.theme.dark !== nextProps.theme.dark) {
            const {
                theme: {
                    colors: { background },
                    dark,
                },
            } = nextProps;
            this.props.navigation.setParams({
                headerStyle: Styles.Common.toolbar(background, dark),
                dark,
            });
        }
    }

    render() {
        const { navigation } = this.props;
        return <Notifications navigation={navigation}
        />;
    }
}
