import React from "react";

class Create extends React.Component {
    constructor(props){
        // methods:
        super(props);
        this.AddQuestion = this.AddQuestion.bind(this);
        this.RemoveQuestion = this.RemoveQuestion.bind(this);
        this.EditQuestion = this.EditQuestion.bind(this);
        this.QuizComplete = this.QuizComplete.bind(this);
        //properties:
        this.state = {
            QuizName: '',
            name: '', //question name
            Questions: [],
            menu: true,
            Edit: false,
            Done: false
        }
    }

    AddQuestion() {
        
    }

    RemoveQuestion(name){
        var removeIndex = this.state.Questions.map(item => item.name).indexOf(name);
        var temp = this.state.Questions;
        ~removeIndex && temp.splice(removeIndex, 1);
        this.setState({
            Questions: temp,
        })
    }

    EditQuestion(){

    }

    QuizComplete(){ // quiz is complete, compile into JSON 

    }
    //Events:
    EditName(e){
        this.setState({QuizName: e.target.value})
    }

    //Renders:
    RenderQuestions(){
        return this.state.Questions.map(({name}, index) => (
            <div key={index} style={{marginBottom: '1em', fontWeight:'600', height:'40px', marginRight:'20px'}}>
                <button className="field-button" onClick={ () => this.RemoveQuestion(name)}>{name}</button>
            </div>
        ))
    }
    
    render() {
        const {QuizName, name, Questions, menu, Edit, Done} = this.state;
        if (menu){ // display overview of questions
            return (
                <>
                    <h1>
                        Welcome To Create
                    </h1>
                    <p>
                        QuizName:
                        <input type="text" name="desc" defaultValue={QuizName} onChange={this.EditName}/>
                    </p>
                    <div className="Quiz-Name-field">
                        Main Menu
                        <button className="field-button em1" onClick={this.joinMenu}>Join</button>
                        <button className="field-button em1" onClick={this.hostMenu}>Host</button>
                    </div>
                </>
            );
        }
        else if(Edit){ // edit selected question

        }
        else if(Done){ // JSON donwload

        }
    }
}

export default Create;