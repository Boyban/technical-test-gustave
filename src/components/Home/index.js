import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import './style.css'

import { withFirebase } from '../Firebase';
import SignInPage from "../SignIn";
import * as ROUTES from "../../constants/routes";
import AuthUserContext from "../Session/context";
import withAuthorization from "../Session/withAuthorization";

const HomePage = () => (
    <div>
        <AuthUserContext.Consumer>
            { authUser => (<Home context={authUser}/>) }
        </AuthUserContext.Consumer>

    </div>
);

class HomePageBase extends Component {
    constructor(props) {
        super(props);

        this.cartState = "No item in your cart";
        this.cartItem = [];
        this.activeCart = [];
    }

    componentDidMount() {
        this.uid = this.props.context.uid;
        this.props.firebase
            .cart(this.uid)
            .once('value', data => {
                data.forEach(child => {
                   this.activeCart = child.val();
                });
                console.log(this.activeCart);
                this.setState({ [""]: "" });
            })
            .catch(error => {
                this.setState({ error });
            });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    createRandomCart = () => {
        let rand =  1 + (Math.random() * (5-1));
        let items = [
            "T-Shirt",
            "Jean",
            "Basket",
            "Socks",
            "Glasses",
            "Hat",
            "Pull",
            "Watch",
        ];
        this.cartState = "";

        console.log(this.uid);
        for (let i = 0; i < rand; ++i) {
            let pos = Math.round(Math.random() * 7);
            this.cartItem.push(items[pos]);
            this.cartState += "1 " + items[pos] + " " ;
        }
        this.setState({ [""]: "" });
    };

    sendCart = () => {
        let cartItem = this.cartItem;
        this.props.firebase
            .cart(this.uid)
            .set({
                cartItem
            })
            .then(() => {
                this.cartState = "No item in your card";
                this.activeCart = this.cartItem;
                this.cartItem = [];
                this.setState({ [""]: "" });
            })
            .catch(error => {
                this.setState({ error });
            });

    };

    render() {
        var listItems = this.activeCart.map(function(item) {
            return (
                <li key="{item}">
                    {item}
                </li>
            );
        });
        const cartState = this.cartState;
        const isInvalid = cartState === "No item in your cart";
        return (
            <div>
                <div className="randomCart">
                    {cartState && <p name="cartState">{cartState}</p>}
                    <div className="buttonCart">
                        <button className="randomBtn" onClick={this.createRandomCart}>Create a random cart</button>
                        <button disabled={isInvalid} className="validateBtn" onClick={this.sendCart}>Validate cart</button>
                    </div>
                </div>
                <hr />

                <div className="activeCart">
                    <h1>Active Cart</h1>
                    <ul>
                        { listItems }
                    </ul>
                </div>
            </div>
        )
    }
}

const Home = compose(
    withRouter,
    withFirebase,
)(HomePageBase);


export { Home };

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(HomePage);