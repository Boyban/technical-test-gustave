import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import './style.css'
import withAuthorization from "../Session/withAuthorization";

class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            if (!usersObject) {
                this.setState({loading: false});
                return;
            }
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            usersList.forEach(user =>{
               user.activeCart = [];
            });

            usersList.forEach(user =>{
               this.props.firebase.cart(user.uid).on('value', data => {
                   data.forEach(child => {
                       user.activeCart = child.val();
                       this.setState({
                           users: usersList,
                           loading: false,
                       });
                   });
               });
            });

            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        const { users, loading } = this.state;

        return (
            <div>
                {loading && <div>Loading ...</div>}

                <div className="UserList">
                    <UserList users={users} />
                </div>
            </div>
        );
    }
}

const UserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <p>
                  <strong>ID:</strong> {user.uid}
                </p>
                <p>
                  <strong>E-Mail:</strong> {user.email}
                </p>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <hr />
                <p className="cartTitle">Active Cart</p>
                <ul className="cartList">
                    {user.activeCart.map(item => (
                        <li key={item}>
                            {item}
                        </li>
                    ))}
                </ul>
            </li>
        ))}
    </ul>
);

//export default withFirebase(AdminPage);

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(AdminPage);