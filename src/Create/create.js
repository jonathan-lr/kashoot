import React from "react";
class Question{
    //properties:
    question = "QUESTION TEXT";
    img = "IMG URL";
    answers = []; //answers to the question (len 4)
    correct = []; //correct answers (up to len 4)
    trick = []; //location of trick answers in Question
    type = 0; //type 1: normal type 2: image

    // methods:
    //Setters:
    SetName(name){
        this.question = name;
    }
    SetImg(URL){
        this.img = URL;
    }
    SetAnswers(arr){
        this.answers = [];
    }
    //etc.
}
class Create extends React.Component {
    constructor(props){
        // methods:
        super(props);
        this.AddQuestion = this.AddQuestion.bind(this);
        this.RemoveQuestion = this.RemoveQuestion.bind(this);
        this.EditQuestion = this.EditQuestion.bind(this);
        this.QuizComplete = this.QuizComplete.bind(this);
        this.EditName = this.EditName.bind(this);

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


    AddQuestion() { // question menu, ask for question and 4 answers
        this.setState({menu: false, Edit: true})
        var Q = new Question();
        
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
    EditName(event){
        this.setState({QuizName: event.target.value})
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
                    <p>
                        <div style={{display:'flex'}}>
                                {this.RenderQuestions()}
                        </div>
                    </p>
                    
                    <div className="Quiz-Name-field"> 
                        Main Menu (turn this into a sidebar)
                        <button className="field-button em1" onClick={this.EditQuestion}>Edit</button>
                        <button className="field-button em1" onClick={this.AddQuestion}>Add Question</button>
                    </div>
                </>
            );
        }
        else if(Edit){ // edit mode

        }
        else if(Done){ // JSON donwload

        }
    }
}

export default Create;