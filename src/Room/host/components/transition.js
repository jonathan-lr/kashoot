import React from 'react';

class transition extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: this.props.active,
        }
    }

    render() {
        const { active } = this.state
        return (
            <div id="Transition">
                <div className="transition" />
                <div className="transition-item" />
                <div className="transition-item2" />
            </div>
        )
    }
}

export default transition