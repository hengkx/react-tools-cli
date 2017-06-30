import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Bundle extends Component {
    state = {
        // short for "module" but that's a keyword in js, so "mod"
        mod: null
    }

    static propTypes = {
        load: PropTypes.func,
        children: PropTypes.func
    }

    componentWillMount () {
        this.load(this.props)
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps)
        }
    }

    load (props) {
        this.setState({
            mod: null
        })
        props.load( (mod) => {
            this.setState({
                // handle both es imports and cjs
                mod: mod.default ? mod.default : mod
            })
        })
    }

    render () {
        // if state mode not undefined,The container will render children
        return this.state.mod ? this.props.children(this.state.mod) : null
    }
}
