import React from 'react';
import io from 'socket.io-client';
import loop1 from '../loop 1.wav'
import loop2 from '../loop 2.wav'
import loop3 from '../loop 3.wav'
import Timer from "react-compound-timer";
import '../room.css'
const socket = io('http://ts.cosmicreach.co.uk:27015');

var l1 = new Audio(loop1);
var l2 = new Audio(loop2);
var l3 = new Audio(loop3);
l1.loop = true;
l2.loop = true;
l3.loop = true;
l1.volume = 0.02;
l2.volume = 0.02;
l3.volume = 0.02;

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
            red: 1,
            blue: 1,
            green: 1,
            yellow: 1,
            fake: 1
        })
        score.map( ({correct}) => {
            if (correct === 1) {
                this.setState({
                    red: this.state.red + 1
                })
            } else if (correct === 2) {
                this.setState({
                    blue: this.state.blue + 1
                })
            } else if (correct === 3) {
                this.setState({
                    green: this.state.green + 1
                })
            } else if (correct === 4) {
                this.setState({
                    yellow: this.state.yellow + 1
                })
            } else if (correct === 5) {
                this.setState({
                    fake: this.state.fake + 1
                })
            }
        })
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
        socket.emit('start')
    }

    nextQuestion(){
        socket.emit('next')
    }

    render() {
        const { room, question, answer, answers, next, score, type, finished, img, bar, red, blue, green, yellow, fake, last } = this.state;
            if (answer) {
                return (
                    <>
                        <div className="skip-box">
                            <button className="field-button" onClick={ () => this.nextQuestion() }>Skip</button>
                        </div>
                        <div className="timer-box">
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
                                        <div className="timer-text">
                                            <Timer.Seconds />
                                        </div>
                                    </React.Fragment>
                                )}
                            </Timer>
                        </div>
                        {type === 2
                            ? <span className="question-box"><div className="question-font">{question}</div><img src={img} alt="question" /></span>
                            : <span className="question-box">{question}</span>}
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
            } else if (bar) {
                return(
                    <>
                        <div style={{ display: "flex", flexFlow: "wrap-reverse", }}>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{red-1}</div>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{blue-1}</div>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{green-1}</div>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{yellow-1}</div>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{fake-1}</div>
                        </div>
                        <div style={{ display: "flex", flexFlow: "wrap-reverse", }}>
                            <div style={{ width: "4em", background:'#ae0000', height: red*50+"px", margin: '10px' }}></div>
                            <div style={{ width: "4em", background:'#5656d7', height: blue*50+"px", margin: '10px' }}></div>
                            <div style={{ width: "4em", background:'#197219', height: green*50+"px", margin: '10px' }}></div>
                            <div style={{ width: "4em", background:'#c6922f', height: yellow*50+"px", margin: '10px' }}></div>
                            <div style={{ width: "4em", background:'#ae53a4', height: fake*50+"px", margin: '10px' }}></div>
                        </div>
                        <div style={{ display: "flex", flexFlow: "wrap-reverse", }}>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{last.correct.includes(1) ? '✔' : '✘'}</div>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{last.correct.includes(2) ? '✔' : '✘'}</div>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{last.correct.includes(3) ? '✔' : '✘'}</div>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{last.correct.includes(4) ? '✔' : '✘'}</div>
                            <div style={{ width: "2em", padding: "1em", margin: '10px' }}>{last.correct.includes(5) ? '✔' : '✘'}</div>
                        </div>
                        <button style={{marginTop:'1em'}} className="field-button" onClick={ () => this.goNext()}>Next</button>
                    </>
                )
            } else if (next) {
                return(
                    <>
                        <div className="score-box">
                            <div style={{marginBottom:'1em'}}>Scores</div>
                            {score.map((item) => (
                                <button className="leaderboard" onClick={ () => this.kick(item.name)} key={item.name}>
                                    <span style={{marginLeft: '10px', width: '110px', maxWidth: '110px', textAlign:'start'}}>{score.indexOf(item)+1}.</span>
                                    <span style={{flex: '1'}}>{item.name}</span>
                                    <span style={{width: '120px', maxWidth: '120px', textAlign: 'end'}}>{item.score}</span>
                                </button>
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
                            <div style={{display:'flex', flexWrap:'wrap'}}>
                                {this.renderPlayers()}
                            </div>
                            <button className="field-button" onClick={this.startGame}>Start</button>
                        </div>
                    </>
                )
            }
    }
}

export default host;