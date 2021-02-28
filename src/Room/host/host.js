import React from 'react';
import io from 'socket.io-client';
import loop1 from '../Lupus Nocte - Milky Way Express.mp3'
import loop2 from '../Lupus Nocte - Hadouken.mp3'
import loop3 from '../Lupus Nocte - Howling.mp3'
import Timer from "react-compound-timer";
import Snowfall from "react-snowfall";
import '../room.css'
import shortid from "shortid";
const socket = io('http://ts.cosmicreach.co.uk:27015');

var l1 = new Audio(loop1);
var l2 = new Audio(loop2);
var l3 = new Audio(loop3);
l1.loop = true;
l2.loop = true;
l3.loop = true;
l1.volume = 0.01;
l2.volume = 0.01;
l3.volume = 0.01;

class host extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            answer: false,
            bar: false,
            next: false,
            finished: false,
            answers: [],
            score: [],
            players: [],
            room: '',
            question: '',
            img: '',
            alert: '',
            type: 1,
            last: 0,
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
            fake: 0,
        }
    }

    goNext() {
        this.setState({
            bar: false,
            next: true,
        })
    }

    getBars(score) {
        this.setState({
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
            fake: 0
        })
        let i;
        for (i = 0; i < score.length; i++) {
            if (score[i].answer === 1) {
                this.setState({
                    red: this.state.red + 1
                })
            } else if (score[i].answer === 2) {
                this.setState({
                    blue: this.state.blue + 1
                })
            } else if (score[i].answer === 3) {
                this.setState({
                    green: this.state.green + 1
                })
            } else if (score[i].answer === 4) {
                this.setState({
                    yellow: this.state.yellow + 1
                })
            } else if (score[i].answer === 5) {
                this.setState({
                    fake: this.state.fake + 1
                })
            }
        }
    }

    renderPlayers() {
        return this.state.players.map(({name}, index) => (
            <div key={index} style={{marginBottom: '1em', fontWeight:'600', height:'40px', marginRight:'20px'}}>
                <button className="field-button menu-jump" onClick={ () => this.kick(name)}>{name}</button>
            </div>
        ))
    }

    kick(name) {
        let room = this.state.room
        socket.emit('kicks', {name, room})
        var removeIndex = this.state.players.map(item => item.name).indexOf(name);
        var temp = this.state.players
        ~removeIndex && temp.splice(removeIndex, 1);
        this.setState({
            players: temp,
        })
    }

    endLobby() {
        socket.emit('closed')
    }

    componentWillUnmount() {
        this.endLobby()
    }

    componentDidMount() {
        window.addEventListener(
            "beforeunload",
            this.endLobby.bind(this)
        );

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

        socket.on('hoster', ({q, a, i, t, w}) => {
            this.setState({
                question: q,
                img: i,
                answers: a,
                type: t,
                alert: w,
                answer: true,
                next: false,
            })

            l1.pause();
            l3.pause();
            l2.play();
        })

        socket.on('next', ({score, last}) => {
            this.setState({
                score: score,
                last: last,
                answer: false,
                bar: true,
            })

            this.getBars(score)
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
        let room = this.state.room
        socket.emit('start', {room})
    }

    nextQuestion(){
        let room = this.state.room
        socket.emit('next', {room})
    }

    getRandomKey() {
        return shortid.generate();
    }

    render() {
        const { room, question, answer, answers, next, score, type, finished, img, bar, red, blue, green, yellow, fake, last, alert } = this.state;
            if (answer) {
                return (
                    <>
                        <Snowfall />
                        <div id="Transition4" key={this.getRandomKey()}>
                            <div className="transition" />
                            <div className="transition-item" />
                            <div className="transition-item2" />
                        </div>
                        <div className="widgets" key={this.getRandomKey()}>
                            <button className="skip-button" onClick={ () => this.nextQuestion() }>SKIP</button>
                            <Timer
                                initialTime={45000}
                                direction="backward"
                                checkpoints={[
                                    {
                                        time: 0,
                                        callback: () => this.nextQuestion(),
                                    }
                                ]}
                            >
                                {() => (
                                    <React.Fragment>
                                        <div className="timer-text">
                                            <Timer.Seconds />
                                        </div>
                                    </React.Fragment>
                                )}
                            </Timer>
                        </div>
                        {type === 2
                            ? (
                                <>
                                    <div className="question-box" key={this.getRandomKey()}>
                                        <img src={img} alt="question" />
                                    </div>
                                    <div className="question-font" key={this.getRandomKey()}>{question}</div>
                                </>
                                )
                            : (
                                <>
                                    <span style={{width: "80%", height: 'auto'}} className="question-box question-font">{question}</span>
                                </>
                            )}
                        <div className={(type === 2 ? 'questions-box' : 'questions-box2')} key={this.getRandomKey()}>
                            <div className="host-answer red"><span>{answers[0]}</span></div>
                            <div className="host-answer blue"><span>{answers[1]}</span></div>
                            <div className="host-answer green"><span>{answers[2]}</span></div>
                            <div className="host-answer orange"><span>{answers[3]}</span></div>
                        </div>
                    </>
                )
            } else if (bar) {
                let lastAnswers = last.correct.map(x => {
                    if (x === 5) {
                        return "Fake"
                    } else {
                        return answers[x - 1]
                    }
                })
                return(
                    <>
                        <Snowfall />
                        <div id="Transition3" key={this.getRandomKey()}>
                            <div className="transition" />
                            <div className="transition-item" />
                            <div className="transition-item2" />
                        </div>
                        <div className="lastAnswer-box" key={this.getRandomKey()}>
                            {lastAnswers.map((item) => (
                                <div>
                                    • {item}
                                </div>
                            ))}
                        </div>
                        <div className="next-box" key={this.getRandomKey()}>
                            <button className="next-button" onClick={ () => this.goNext()}>NEXT</button>
                        </div>
                        <div className={"alert-box " + (alert === '' ? 'hidden' : '')} key={this.getRandomKey()}>
                            {alert}
                        </div>
                        <div className="bar-box" key={this.getRandomKey()}>
                            <div className="bar-item">
                                <div className="item-bar">{red}</div>
                                <div className="item-bar">{blue}</div>
                                <div className="item-bar">{green}</div>
                                <div className="item-bar">{yellow}</div>
                                <div className="item-bar">{fake}</div>
                            </div>
                            <div className="bar-item" style={{ flex: '1' }}>
                                <div className="bar red" style={{height: red*50+10+"px"}}></div>
                                <div className="bar blue" style={{height: blue*50+10+"px"}}></div>
                                <div className="bar green" style={{height: green*50+10+"px"}}></div>
                                <div className="bar orange" style={{height: yellow*50+10+"px"}}></div>
                                <div className="bar pink" style={{height: fake*50+10+"px"}}></div>
                            </div>
                            <div className="bar-item">
                                <div className="item-bar">{last.correct.includes(1) ? '✔' : '✘'}</div>
                                <div className="item-bar">{last.correct.includes(2) ? '✔' : '✘'}</div>
                                <div className="item-bar">{last.correct.includes(3) ? '✔' : '✘'}</div>
                                <div className="item-bar">{last.correct.includes(4) ? '✔' : '✘'}</div>
                                <div className="item-bar">{last.correct.includes(5) ? '✔' : '✘'}</div>
                            </div>
                        </div>
                    </>
                )
            } else if (next) {
                return(
                    <>
                        <Snowfall />
                        <div id="Transition2" key={this.getRandomKey()}>
                            <div className="transition" />
                            <div className="transition-item" />
                            <div className="transition-item2" />
                        </div>
                        <div className="score-box" key={this.getRandomKey()}>
                            {score.map((item) => (
                                <button className="leaderboard" onClick={ () => this.kick(item.username)} key={item.username}>
                                    <span style={{marginLeft: '10px', width: '110px', maxWidth: '110px', textAlign:'start'}}>{score.indexOf(item)+1}.</span>
                                    <span style={{flex: '1'}}>{item.username}</span>
                                    <span style={{width: '120px', maxWidth: '120px', textAlign: 'end'}}>{item.score} {last.correct.includes((score.find( ({ username }) => username === item.username )).answer) ? '✔' : '✘'}</span>
                                </button>
                            ))}
                        </div>
                        <div className="stats-box" key={this.getRandomKey()}>
                        </div>
                        <div className="next-box" key={this.getRandomKey()}>
                            <button className="next-button" onClick={ () => this.startGame()}>Next</button>
                        </div>
                    </>
                )
            } else if (finished) {
                return(
                    <>
                        <Snowfall />
                        <div id="Transition1" key={this.getRandomKey()}>
                            <div className="transition" />
                            <div className="transition-item" />
                            <div className="transition-item2" />
                        </div>
                        <div className="final-box" key={this.getRandomKey()}>
                            {score.map((item) => (
                                <button className="leaderboard" onClick={ () => this.kick(item.username)} key={item.username}>
                                    <span style={{marginLeft: '10px', width: '110px', maxWidth: '110px', textAlign:'start'}}>{score.indexOf(item)+1}.</span>
                                    <span style={{flex: '1'}}>{item.username}</span>
                                    <span style={{width: '120px', maxWidth: '120px', textAlign: 'end'}}>{item.score}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )
            } else {
                return (
                    <>
                        <Snowfall />
                        <div className="top-host">
                            <div className="logo" >KASHOOT.CO.UK</div>
                            <div className="roomCode">ROOM - {room}</div>
                        </div>
                        <div className="host-box">
                            <div style={{display:'flex', flexWrap:'wrap', height:'85%', padding:'0 50px'}}>
                                {this.renderPlayers()}
                            </div>
                            <button className="field-button" onClick={ () => this.startGame()}>START</button>
                        </div>
                    </>
                )
            }
    }
}

export default host;