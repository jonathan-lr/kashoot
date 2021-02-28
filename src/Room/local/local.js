import React from 'react';
import io from 'socket.io-client';
import '../room.css'
const socket = io('http://ts.cosmicreach.co.uk:27015');

class local extends React.Component {
    constructor(props) {
        super(props);

        this.joinGame = this.joinGame.bind(this);
        this.answer = this.answer.bind(this);

        this.state = {
            name: '',
            user: '',
            room: '',
            error: '',
            question: '',
            ans: '',
            last: 0,
            play: false,
            answer: false,
            next: false,
            answered: false,
            finished: false,
            save: false,
            players: [],
            score: [],
        }
    }

    handleValidation(){
        let name = this.state.name;
        let room = this.state.room;
        let valid = true;
        let message = 'INVALID'

        if (!name.match(/^(?=[a-zA-Z0-9._æøå]{1,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)){
            valid = false;
            message += ' NAME'
        }

        if (room.length !== 5) {
            valid = false;
            message += ' ROOM'
        }

        if (!valid){
            this.setState({
                error: message
            })
        }
        return valid;
    }

    onTextChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    joinGame(e) {
        e.preventDefault();
        if (this.handleValidation()){
            const {name, room} = this.state;
            socket.emit('join', {name, room})
            this.setState({
                play: true,
                save: true
            })
        }
    }

    saveStateToLocalStorage() {
        if (this.state.save) {
            for (let key in this.state) {
                localStorage.setItem(key, JSON.stringify(this.state[key]));
            }
        } else {
            localStorage.clear();
        }
    }

    getStateFromLocalStorage() {
        var strings = ['name', 'user', 'room', 'error', 'question']
        for (let key in this.state) {
            if (strings.includes(key)) {
                this.setState({
                    [key]: JSON.parse(localStorage.getItem(key)).toString()
                })
            } else {
                this.setState({
                    [key]: JSON.parse(localStorage.getItem(key))
                })
            }
        }
        let name = JSON.parse(localStorage.getItem('name')).toString();
        let room = JSON.parse(localStorage.getItem('room')).toString();
        socket.emit('rejoin', {name, room})
    }


    componentWillUnmount() {
        window.removeEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );

        this.saveStateToLocalStorage();
    }

    componentDidMount(){
        if (localStorage.getItem("user") !== null) {
            this.getStateFromLocalStorage();
        }

        window.addEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );

        socket.on('issue', ({message, name}) => {
            console.log(name)
            if (name) {
                if (name === this.state.name) {
                    this.setState({
                        play: false,
                        answer: false,
                        next: false,
                        answered: false,
                        save: false,
                        error: message,
                    })
                    localStorage.clear();
                }
            } else {
                this.setState({
                    play: false,
                    answer: false,
                    next: false,
                    answered: false,
                    save: false,
                    error: message,
                })
                localStorage.clear();
            }

        })

        socket.on('player', ({q}) => {
            this.setState({
                question: q,
                answer: true,
                next: false,
            })
        })

        socket.on('next', ({score, last}) => {
            console.log(score)
            console.log(last)
            this.setState({
                score: score,
                last: last,
                user: this.state.name,
                answer: false,
                answered: false,
                next: true,
            })
        })

        socket.on('finished', ({score}) => {
            this.setState( {
                save: false,
                answer: false,
                answered: false,
                next: false,
                finished: true,
                score: score,
            })

        })
    }

    answer(ans){
        let name = this.state.name
        let room = this.state.room
        let answer = ans
        socket.emit('answer', {name, answer, room})
        this.setState({
            answered: true,
            answer: false,
            ans: ans,
        })
    }

    render() {
        const { name, room, play, answer, answered, next, score, finished, user, error, last } = this.state;
        if (play) {
            if (answer) {
                return (
                    <>
                        <div className="top-bar">
                            <div>NAME - {name}</div>
                            <div>ROOM - {room}</div>
                        </div>
                        <div style={{display: "flex"}}>
                            <button onClick={ () => this.answer(1)} className="display-answer red" />
                            <button onClick={ () => this.answer(2)} className="display-answer blue" />
                        </div>
                        <div style={{display: "flex"}}>
                            <button onClick={ () => this.answer(3)} className="display-answer green" />
                            <button onClick={ () => this.answer(4)} className="display-answer orange" />
                        </div>
                        <div className="btn btn-one" onClick={ () => this.answer(5)}>
                            <span>Fake</span>
                        </div>
                    </>
                )
            } else if (next) {
                return (
                    <>
                        <div className="top-bar">
                            <div>NAME - {name}</div>
                            <div>ROOM - {room}</div>
                        </div>
                        <div className={last.correct.includes((score.find( ({ username }) => username === user )).answer) ? 'correct' : 'incorrect'}></div>
                        <div className="localFont">
                            GET READY FOR THE NEXT QUESTION!
                        </div>
                    </>
                )
            } else if (answered) {
                return (
                    <>
                        <div className="top-bar">
                            <div>NAME - {name}</div>
                            <div>ROOM - {room}</div>
                        </div>
                        <div className="localFont">
                            WAIT FOR OTHERS TO FINISH
                        </div>
                    </>
                )
            } else if (finished) {
                return(
                    <>
                        <div className="top-bar">
                            <div>NAME - {name}</div>
                            <div>ROOM - {room}</div>
                        </div>
                        Quiz is over!
                        {score.map((item) => (
                            <div key={item.name}>
                                <span>{item.name} - {item.score}</span>
                            </div>
                        ))}
                    </>
                )
            } else {
                return (
                    <>
                        <div className="top-bar">
                            <div>NAME - {name}</div>
                            <div>ROOM - {room}</div>
                        </div>
                        <div className="localFont">
                            GET READY FOR HOST TO START
                        </div>
                    </>
                )
            }
        } else {
            return (
                <>
                    <div style={{display: "flex"}}>
                        <div className={"error-box " + (error === '' ? 'hidden' : '')}>{error}</div>
                        <form onSubmit={this.joinGame} className="login-box">
                            <div className="field-text">
                                <input name="name" onChange={e => this.onTextChange(e)} value={name} placeholder="Name" />
                            </div>
                            <div className="field-text">
                                <input name="room" onChange={e => this.onTextChange(e)} value={room} placeholder="Room" />
                            </div>
                            <button className="field-button">Join</button>
                        </form>
                    </div>
                </>
            );
        }
    }
}

export default local;