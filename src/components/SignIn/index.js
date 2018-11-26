
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import './style.css'

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
    <div>
        <SignInForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    componentDidMount() {
        document.body.style.background = "url('https://i.pinimg.com/originals/a0/da/cb/a0dacbf4a4e06a776fa8e8a3cd6b24cc.png') no-repeat center fixed";
        document.body.style.webkitBackgroundSize = "cover";
        document.body.style.backgroundSize = "cover";
    }

    componentWillUnmount(){
        document.body.style.backgroundImage = "";

    }


    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <div className="card">
                <h1>Sign In</h1>
                <form onSubmit={this.onSubmit}>
                    <div>
                    <input
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                    />
                    </div>
                <div>
                    <input
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                    />
                </div>
                    <div>
                    <button disabled={isInvalid} type="submit">
                        Sign In
                    </button>
                    </div>

                    {error && <p>{error.message}</p>}
                    <div>
                        <SignUpLink />
                        <PasswordForgetLink />
                    </div>
                </form>
            </div>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };