import React from 'react';
import io from 'socket.io-client';
import howling from './howling.mp3'
import Timer from "react-compound-timer";
import './room.css'
const socket = io('http://92.239.26.13:27015');

var audio = new Audio(howling);

class Room extends React.Component {
    constructor(props) {
        super(props);

        this.joinGame = this.joinGame.bind(this);
        this.joinMenu = this.joinMenu.bind(this);
        this.hostMenu = this.hostMenu.bind(this);
        this.answer = this.answer.bind(this);

        this.state = {
            name: '',
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
            <div key={index} style={{marginRight:'20px', fontWeight:'600', height:'40px'}}>
                <span>
                    {name}
                </span>
            </div>
        ))
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

        socket.on('player', ({q}) => {
            this.setState({
                question: q,
                answer: true,
                next: false,
            })
            audio.play();
            audio.volume = 0.02;
        })

        socket.on('next', () => {
            this.setState({
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
            audio.play();
            audio.volume = 0.02;
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
            console.log(score)
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
        const { name, room, menu, join, host, play, question, answer, answers, answered, next, score, type, finished, img } = this.state;
        if (menu) {
            return (
                <>
                    Main Menu
                    <div style={{display: 'flex'}}>
                        <button className="lets-begin" onClick={this.joinMenu}>Join</button>
                        <button className="lets-begin" onClick={this.hostMenu}>Host</button>
                    </div>
                </>
            )
        } else if (join) {
            return (
                <>
                    <div style={{display: "flex"}}>
                        <form onSubmit={this.joinGame} style={{background: "#004b83", padding:"10px", borderRadius:"10px"}}>
                            <div className="name-field">
                                <span>Name : </span>
                                <input name="name" onChange={e => this.onTextChange(e)} value={name} lable="Name" />
                            </div>
                            <div>
                                <span>Room : </span>
                                <input name="room" onChange={e => this.onTextChange(e)} value={room} lable="Room" />
                            </div>
                            <button className="lets-begin">Join</button>
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
                            ? <span className="question-norm question-img"><div>{question}</div><img style={{width:"100%"}} src={img} /></span>
                            : <span className="question-norm">{question}</span>}
                        <div style={{display: "flex"}}>
                            <div className="display-answer red"><span>{answers[0]}</span></div>
                            <div className="display-answer blue"><span>{answers[1]}</span></div>
                        </div>
                        <div style={{display: "flex"}}>
                            <div className="display-answer green"><span>{answers[2]}</span></div>
                            <div className="display-answer orange"><span>{answers[3]}</span></div>
                        </div>
                    </>
                )
            } else if (next) {
                return(
                    <>
                        <h1>Scores</h1>
                        {score.map((item) => (
                            <div key={item.name}>
                                <span>{item.name} | {item.score}</span>
                            </div>
                        ))}
                        <button className="lets-begin" onClick={this.startGame}>Next</button>
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
                        <p>Room Code Is {room}</p>
                        <div style={{background:"#004b83", width:"800px", height:"500px", borderRadius:"10px", display:'flex', padding:'20px', flexWrap:'wrap', alignContent:'flex-start'}}>
                            {this.renderPlayers()}
                        </div>
                        <button className="lets-begin" onClick={this.startGame}>Start</button>
                    </>
                )
            }
        } else if (play) {
            if (answer) {
                return (
                    <>
                        <div style={{display: "flex"}}>
                            <button onClick={ () => this.answer(1)} className="display-answer red"><span>A</span></button>
                            <button onClick={ () => this.answer(2)} className="display-answer blue"><span>B</span></button>
                        </div>
                        <div style={{display: "flex"}}>
                            <button onClick={ () => this.answer(3)} className="display-answer green"><span>C</span></button>
                            <button onClick={ () => this.answer(4)} className="display-answer orange"><span>D</span></button>
                        </div>
                        <div className="btn btn-one" onClick={ () => this.answer(5)}>
                            <span>Lies</span>
                        </div>
                    </>
                )
            } else if (next) {
                return (
                    <>
                        Get Ready For Next Question
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