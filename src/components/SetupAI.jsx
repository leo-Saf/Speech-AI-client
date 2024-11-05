import React from 'react';
import { promptGPT } from '../client';

const SetupAI = () => {
    const valuesOne = 'Write to me like I am a child';
    const valuesTwo = 'Write to me with advanced proffesional words';

     const handleClick = async (value) => {
        try {
            const response = await promptGPT(value);
            alert(response.response);
        } catch (error) {
            console.error('Error fetching response: ', error);
            alert('Something went wrong, please try again');
        }
        
     }

    return (
        <div style={{textAlign: 'center'}}>
            <h1>Set up AI</h1>
            <button style = {{display: 'block', margin: '20px auto'}} onClick={() => handleClick(valuesOne)}>AI should talk like child</button>
            <button style = {{display: 'block', margin: '20px auto'}} onClick={() => handleClick(valuesTwo)}>AI should talk with advanced language</button>
        </div>
    );
};

export default SetupAI;
