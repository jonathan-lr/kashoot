import React from 'react';
import io from 'socket.io-client';
import loop1 from '../Lupus Nocte - Milky Way Express.mp3'
import loop2 from '../Lupus Nocte - Hadouken.mp3'
import loop3 from '../Lupus Nocte - Howling.mp3'
import Timer from "react-compound-timer";
import Snowfall from "react-snowfall";
import '../room.css'
import './host.css'
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

        this.section = this.section.bind(this)

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
            section: 0,
        }
    }

    goNext() {
        this.setState({
            bar: false,
            next: true,
        })
    }

    section() {
        let temp = this.state.section
        temp += 1
        this.setState({
            section: temp
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
        this.setState({
            section: 0
        })
    }

    getRandomKey() {
        return shortid.generate();
    }

    render() {
        const { room, question, answer, answers, next, score, type, finished, img, bar, red, blue, green, yellow, fake, last, alert, section } = this.state;
            if (answer) {
                if (type === 3) {
                    if (section === 0) {
                        return (
                            <>
                                {/*<Snowfall*/}
                                <div style={{position: "absolute", bottom: 30, right: 10, zIndex: "200"}}>
                                    <button style={{width: "100px"}} className="field-button" onClick={ () => this.section() }>SKIP</button>
                                </div>
                                <div id="Transition4" key={this.getRandomKey()}>
                                    <div className="transition" />
                                    <div className="transition-item" />
                                    <div className="transition-item2" />
                                </div>
                                <div className="video-box">
                                    <video onEnded={() => this.section()} autoPlay src={img[0]} />
                                </div>
                            </>
                        )
                    } else if (section === 1) {
                        return (
                            <>
                                {/*<Snowfall*/}
                                <div id="Transition4" key={this.getRandomKey()}>
                                    <div className="transition" />
                                    <div className="transition-item" />
                                    <div className="transition-item2" />
                                </div>
                                <div className="widgets" key={this.getRandomKey()}>
                                    <button className="skip-button" onClick={ () => this.section() }>SKIP</button>
                                    <Timer
                                        initialTime={45000}
                                        direction="backward"
                                        checkpoints={[
                                            {
                                                time: 0,
                                                callback: () => this.section(),
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
                                <div className="question-box" key={this.getRandomKey()}>
                                    <video autoPlay muted loop src={img[0]} />
                                </div>
                                <div className="question-font" key={this.getRandomKey()}>{question}</div>
                                <div className='questions-box' key={this.getRandomKey()}>
                                    <div className="host-answer red"><span>{answers[0]}</span></div>
                                    <div className="host-answer blue"><span>{answers[1]}</span></div>
                                    <div className="host-answer green"><span>{answers[2]}</span></div>
                                    <div className="host-answer orange"><span>{answers[3]}</span></div>
                                </div>
                            </>
                        )
                    } else {
                        return (
                            <>
                                {/*<Snowfall*/}
                                <div style={{position: "absolute", bottom: 30, right: 10, zIndex: "200"}}>
                                    <button style={{width: "100px"}} className="field-button" onClick={ () => this.nextQuestion() }>SKIP</button>
                                </div>
                                <div id="Transition4" key={this.getRandomKey()}>
                                    <div className="transition" />
                                    <div className="transition-item" />
                                    <div className="transition-item2" />
                                </div>
                                <div className="video-box">
                                    <video onEnded={() => this.nextQuestion()} autoPlay src={img[1]} />
                                </div>
                            </>
                        )
                    }
                } else {
                    return (
                        <>
                            {/*<Snowfall*/}
                            <div id="Transition4" key={this.getRandomKey()}>
                                <div className="transition" />
                                <div className="transition-item" />
                                <div className="transition-item2" />
                            </div>
                            <div className="top-row">
                                <div className="content-box" key={this.getRandomKey()}>
                                    <div className="header">
                                        content
                                    </div>
                                    <div className="container">
                                        <img src={img} alt="question" />
                                    </div>
                                </div>
                                <div className="question-box" key={this.getRandomKey()}>
                                    <div className="header">question</div>
                                    <div className="text">
                                        {question}
                                    </div>
                                </div>
                                <div className="widget-box" key={this.getRandomKey()}>
                                    <div className="header">widgets</div>
                                    <div className="widget">
                                        <Timer initialTime={45000} direction="backward" checkpoints={[{time: 0, callback: () => this.nextQuestion(),}]}>
                                            {() => (<Timer.Seconds />)}
                                        </Timer>
                                    </div>
                                    <div className="widget" onClick={ () => this.nextQuestion() }>skip</div>
                                </div>
                            </div>
                            <div className="option-box" key={this.getRandomKey()}>
                                <div className="header">options</div>
                                <div className="options">
                                    <div className="option red"><span>{answers[0]}</span></div>
                                    <div className="option blue"><span>{answers[1]}</span></div>
                                    <div className="option green"><span>{answers[2]}</span></div>
                                    <div className="option yellow"><span>{answers[3]}</span></div>
                                </div>
                            </div>
                        </>
                    )
                }
            } else if (bar) {
                let lastAnswers = last.correct.map(x => {
                    if (x === 5) {
                        return "Joker"
                    } else {
                        return answers[x - 1]
                    }
                })
                return(
                    <>
                        <Snowfall/>
                        <div id="Transition3" key={this.getRandomKey()}>
                            <div className="transition" />
                            <div className="transition-item" />
                            <div className="transition-item2" />
                        </div>

                        <div className="top-row">
                            <div className="answer-box" key={this.getRandomKey()}>
                                <div className="header">answers</div>
                                {lastAnswers.map((item) => (
                                    <div className="answer">
                                        • {item}
                                    </div>
                                ))}
                            </div>
                            <div className="alert-box" key={this.getRandomKey()}>
                                <div className="header">alert</div>
                                <div className="alert">{alert}</div>
                            </div>
                            <div className="widget-box" key={this.getRandomKey()}>
                                <div className="header">next</div>
                                <div className="widget" onClick={ () => this.goNext()}>next</div>
                            </div>
                        </div>

                        <div className="bar-box" key={this.getRandomKey()}>
                            <div className="header">answers</div>
                            <div className="bars">
                                <div className="bar red" style={{height: red*50+50+"px"}}><div className="text">{red}</div></div>
                                <div className="bar blue" style={{height: blue*50+50+"px"}}><div className="text">{blue}</div></div>
                                <div className="bar green" style={{height: green*50+50+"px"}}><div className="text">{green}</div></div>
                                <div className="bar yellow" style={{height: yellow*50+50+"px"}}><div className="text">{yellow}</div></div>
                                <div className="bar joker" style={{height: fake*50+50+"px"}}><div className="text">{fake}</div></div>
                            </div>
                        </div>
                    </>
                )
            } else if (next) {
                let streak = score.filter(o => o.streak === Math.max(...score.map(o => o.streak)));
                let correct = score.filter(o => o.correct === Math.max(...score.map(o => o.correct)));
                let firstN = score.filter(o => o.firstN === Math.max(...score.map(o => o.firstN)));
                let lastN = score.filter(o => o.lastN === Math.max(...score.map(o => o.lastN)));
                let minus = score.filter(o => o.minus === Math.max(...score.map(o => o.minus)));
                let wrong = score.filter(o => o.wrong === Math.max(...score.map(o => o.wrong)));
                return(
                    <>
                        {/*<Snowfall*/}
                        <div id="Transition2" key={this.getRandomKey()}>
                            <div className="transition" />
                            <div className="transition-item" />
                            <div className="transition-item2" />
                        </div>
                        <div className="score-row">
                            <div className="score-box" key={this.getRandomKey()}>
                                <div className="header">scores</div>
                                <div className="scores">
                                    {score.map((item) => (
                                        <div className="score" onClick={ () => this.kick(item.username)} key={item.username}>
                                            <span style={{marginLeft: '10px', width: '110px', maxWidth: '110px', textAlign:'start'}}>{score.indexOf(item)+1}.</span>
                                            <span style={{flex: '1'}}>{item.username}</span>
                                            <span style={{width: '120px', maxWidth: '120px', textAlign: 'end'}}>{item.score} {last.correct.includes((score.find( ({ username }) => username === item.username )).answer) ? '✔' : '✘'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="score-box" key={this.getRandomKey()}>
                                <div className="header">header</div>
                                <div className="scores">
                                    <div className="score">Best Streak</div>
                                    {streak.slice(0,3).map((item) => (
                                        <div className="score2">{item.username} - {item.streak}</div>
                                    ))}
                                    <div className="score">Most Correct</div>
                                    {correct.slice(0,3).map((item) => (
                                        <div className="score2">{item.username} - {item.correct}</div>
                                    ))}
                                    <div className="score">Fastest Hand</div>
                                    {firstN.slice(0,3).map((item) => (
                                        <div className="score2">{item.username} - {item.firstN}</div>
                                    ))}
                                    <div className="score">Slowest Hand</div>
                                    {lastN.slice(0,3).map((item) => (
                                        <div className="score2">{item.username} - {item.lastN}</div>
                                    ))}
                                    <div className="score">Most Traps Triggered</div>
                                    {minus.slice(0,3).map((item) => (
                                        <div className="score2">{item.username} - {item.minus}</div>
                                    ))}
                                    <div className="score">Dissapointing Performance</div>
                                    {wrong.slice(0,3).map((item) => (
                                        <div className="score2">{item.username} - {item.wrong}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="widget-box" key={this.getRandomKey()}>
                                <div className="header">next</div>
                                <div className="widget" onClick={ () => this.startGame()}>next</div>
                            </div>
                        </div>
                    </>
                )
            } else if (finished) {
                return(
                    <>
                        {/*<Snowfall*/}
                        <div id="Transition1" key={this.getRandomKey()}>
                            <div className="transition" />
                            <div className="transition-item" />
                            <div className="transition-item2" />
                        </div>
                        <div className="score-box" style={{margin:"10px"}} key={this.getRandomKey()}>
                            <div className="header">final scores</div>
                            <div className="scores">
                                {score.map((item) => (
                                    <div className="score" onClick={ () => this.kick(item.username)} key={item.username}>
                                        <span style={{marginLeft: '10px', width: '110px', maxWidth: '110px', textAlign:'start'}}>{score.indexOf(item)+1}.</span>
                                        <span style={{flex: '1'}}>{item.username}</span>
                                        <span style={{width: '120px', maxWidth: '120px', textAlign: 'end'}}>{item.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )
            } else {
                return (
                    <>
                        {/*<Snowfall*/}
                        <div className="top-host">
                            <div className="logo">KASHOOT.CO.UK</div>
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