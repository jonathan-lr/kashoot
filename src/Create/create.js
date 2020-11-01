import React from "react";

class Create extends React.Component {
    constructor(props){
        // methods:

        //properties:
        this.state = {
            QuizName: '',
            Questions: [],
        }
    }

    AddQuestion() {
        
    }

    RemoveQuestion(){

    }

    EditQuestion(){

    }

    QuizComplete(){ // quiz is complete, compile into JSON 
        
    }

    render() {
        return (
            <>
                <p>
                    Welcome To Create
                </p>
            </>
        );
    }
}

export default Create;