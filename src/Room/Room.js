import React from 'react';
import io from 'socket.io-client';
import loop1 from './loop 1.wav'
import loop2 from './loop 2.wav'
import loop3 from './loop 3.wav'
import Timer from "react-compound-timer";
import './room.css'
const socket = io('http://92.239.26.13:27015');

var l1 = new Audio(loop1);
var l2 = new Audio(loop2);
var l3 = new Audio(loop3);
l1.loop = true;
l2.loop = true;
l3.loop = true;
l1.volume = 0.1;
l2.volume = 0.1;
l3.volume = 0.1;

class Room extends React.Component {
    constructor(props) {
        super(props);

        this.joinGame = this.joinGame.bind(this);
        this.joinMenu = this.joinMenu.bind(this);
        this.hostMenu = this.hostMenu.bind(this);
        this.answer = this.answer.bind(this);

        this.state = {
            name: '',
            user: '',
            room: '',
            menu: true,
            host: false,
            join: false,
            play: false,
            answer: false,
            next: false,
            answered: false,
            finished: false,
            players: [],
            question: '',
            img: '',
            answers: [],
            score: [],
            type: 1,
        }
    }

    renderPlayers() {
        return this.state.players.map(({name}, index) => (
            <div key={index} style={{marginBottom: '1em', fontWeight:'600', height:'40px', marginRight:'20px'}}>
                <button className="field-button" onClick={ () => this.kick(name)}>{name}</button>
            </div>
        ))
    }

    kick(name) {
        socket.emit('kicks', {name})
        var removeIndex = this.state.players.map(item => item.name).indexOf(name);
        var temp = this.state.players
        ~removeIndex && temp.splice(removeIndex, 1);
        this.setState({
            players: temp,
        })
    }

    onTextChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    joinGame(e) {
        e.preventDefault();
        const {name, room} = this.state;
        socket.emit('join', {name, room})
        this.setState({
            play: true,
            join: false,
        })
    }

    joinMenu(){
        this.setState({
            menu: false,
            join: true,
        })

        socket.on('taken', () => {
            this.setState({
                menu: true,
                join: false,
                play: false
            })
            window.alert("Username Taken :P")
        })

        socket.on('kick', () => {
            this.setState({
                menu: true,
                join: false,
                play: false
            })
            window.alert("You have been kicked by host :(")
        })

        socket.on('player', ({q}) => {
            this.setState({
                question: q,
                answer: true,
                next: false,
            })
        })

        socket.on('next', ({score}) => {
            this.setState({
                score: score,
                user: this.state.name,
                answer: false,
                answered: false,
                next: true,
            })
        })

        socket.on('finished', ({score}) => {
            this.setState( {
                answer: false,
                answered: false,
                next: false,
                finished: true,
                score: score,
            })

        })
    }

    hostMenu(){
        this.setState({
            menu: false,
            host: true,
        })

        socket.on('host', ({room}) => {
            this.setState({
                room: room,
            })
            l1.play();
            l3.pause();
            l2.pause();
        })

        socket.on('players', ({name}) => {
            let temp = this.state.players;
            temp.push({name})
            this.setState({
                players: temp,
            })
        })

        socket.on('hoster', ({q, a, i, t}) => {
            this.setState({
                question: q,
                img: i,
                answers: a,
                type: t,
                answer: true,
                next: false,
            })
            l1.pause();
            l3.pause();
            l2.play();
        })

        socket.on('next', ({score}) => {
            this.setState({
                answer: false,
                next: true,
                score: score,
            })
        })

        socket.on('finished', ({score}) => {
            this.setState({
                answer: false,
                next: false,
                finished: true,
                score: score,
            })
            l1.pause();
            l3.play();
            l2.pause();
        })

        socket.emit('host')
    }

    startGame(){
        socket.emit('start')
    }

    nextQuestion(){
        socket.emit('next')
    }

    answer(ans){
        let name = this.state.name
        let answer = ans
        socket.emit('answer', {name, answer})
        this.setState({
            answered: true,
            answer: false,
        })
    }

    render() {
        const { name, room, menu, join, host, play, question, answer, answers, answered, next, score, type, finished, img, user } = this.state;
        if (menu) {
            return (
                <>
                    <div className="login-box">
                        Main Menu
                        <button className="field-button em1" onClick={this.joinMenu}>Join</button>
                        <button className="field-button em1" onClick={this.hostMenu}>Host</button>
                    </div>
                </>
            )
        } else if (join) {
            return (
                <>
                    <div style={{display: "flex"}}>
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
        } else if (host) {
            if (answer) {
                return (
                    <>
                        <Timer
                            initialTime={45000}
                            direction="backward"
                            checkpoints={[
                                {
                                    time: 0,
                                    callback: this.nextQuestion,
                                }
                            ]}
                        >
                            {() => (
                                <React.Fragment>
                                    <Timer.Seconds /> seconds
                                </React.Fragment>
                            )}
                        </Timer>
                        {type === 2
                            ? <span className="question-norm question-img"><div>{question}</div><img style={{width:"100%"}} src={img} alt="question" /></span>
                            : <span className="question-norm">{question}</span>}
                        <div style={{display: "flex"}}>
                            <div className="host-answer red"><span>{answers[0]}</span></div>
                            <div className="host-answer blue"><span>{answers[1]}</span></div>
                        </div>
                        <div style={{display: "flex"}}>
                            <div className="host-answer green"><span>{answers[2]}</span></div>
                            <div className="host-answer orange"><span>{answers[3]}</span></div>
                        </div>
                    </>
                )
            } else if (next) {
                return(
                    <>
                        <div className="login-box">
                            <div style={{marginBottom:'1em'}}>Scores</div>
                            {score.map((item) => (
                                <div className="leaderboard" key={item.name}>
                                    <span style={{flex: '1'}}>{score.indexOf(item)+1}.</span>
                                    <span style={{flex: '1'}}>{item.name}</span>
                                    <span style={{flex: '1'}}>{item.score}</span>
                                </div>
                            ))}
                            <button style={{marginTop:'1em'}} className="field-button" onClick={this.startGame}>Next</button>
                        </div>
                    </>
                )
            } else if (finished) {
                return(
                    <>
                        <h3>Standings</h3>
                        <div style={{display:'flex'}}>
                            <div style={{width:'200px', height:'200px', marginTop:'50px', background:'#197219'}}>
                                {score[1].name}
                            </div>
                            <div style={{width:'200px', height:'250px', margin:'0 20px', background:'#ae0000'}}>
                                {score[0].name}
                            </div>
                            <div style={{width:'200px', height:'150px', marginTop:'100px', background:'#5656d7'}}>
                                {score[2].name}
                            </div>
                        </div>
                    </>
                )
            } else {
                return (
                    <>
                        <div className="host-box">
                            <div style={{marginBottom:'1em'}}>Room Code Is {room}</div>
                            <div style={{display:'flex'}}>
                                {this.renderPlayers()}
                            </div>
                            <button className="field-button" onClick={this.startGame}>Start</button>
                        </div>
                    </>
                )
            }
        } else if (play) {
            if (answer) {
                return (
                    <>
                        <div style={{display: "flex"}}>
                            <button onClick={ () => this.answer(1)} className="display-answer red" />
                            <button onClick={ () => this.answer(2)} className="display-answer blue" />
                        </div>
                        <div style={{display: "flex"}}>
                            <button onClick={ () => this.answer(3)} className="display-answer green" />
                            <button onClick={ () => this.answer(4)} className="display-answer orange" />
                        </div>
                        <div className="btn btn-one" onClick={ () => this.answer(5)}>
                            <span>Lies</span>
                        </div>
                    </>
                )
            } else if (next) {
                return (
                    <>
                        {console.log(score.find( ({ name }) => name === user ))}
                        {(score.find( ({ name }) => name === user )).correct ? 'You Got That Correct. Get Ready For The Next Question' : 'You Got That Wrong. Get Ready For The Next Question'}
                    </>
                )
            } else if (answered) {
                return (
                    <>
                        You Have Answered Wait For Others To Finish
                    </>
                )
            } else if (finished) {
                return(
                    <>
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
                        Get Ready For Host To Start
                    </>
                )
            }
        }
    }
}

export default Room;