import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>
        ,
        document.getElementById('app')
    );
};

render(App);

if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept(App, () => {
        render(App);
    });
}
