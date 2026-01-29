'use client';

import { useState } from 'react';

export default function InterviewPractice() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const [questions, setQuestions] = useState<string[]> ([
        "Tell me about a time when you had to work with a difficult team member.",
        "Describe a situation where you had to meet a tight deadline.",
        "Give an example of a time you showed leadership."
    ]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [newQuestion, setNewQuestion] = useState('');
    const [timer, setTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [isQuestionChanging, setIsQuestionChanging] = useState(false);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Sorry, your broswer does not support speech recognition. Please use Chrome or Edge.');
            return;
        }
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            setTimer(0);

            const interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
            setTimerInterval(interval);
        };
        
        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPiece + ' ';
                } else {
                    interimTranscript += transcriptPiece;
                }
            }

            setTranscript(finalTranscript || interimTranscript);
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);

            if (timerInterval) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }
        };
        
        recognition.onend = () => {
            setIsListening(false);
            if (timerInterval) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }
        };

        recognition.start();

        (window as any).currentRecognition = recognition;
    };

    const stopListening = () => {
        if ((window as any).currentRecognition) {
            (window as any).currentRecognition.stop();
        }

        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }

        setIsListening(false);
    };

    const getRandomQuestion = () => {
        setIsQuestionChanging(true);

        setTimeout(() => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * questions.length);
        } while (randomIndex === currentQuestionIndex && questions.length > 1);
        
        setCurrentQuestionIndex(randomIndex);
        setTranscript('');
        setTimer(0);
        setIsQuestionChanging(false);
    }, 300);
    };

    const addQuestion = () => {
        if (newQuestion.trim() !== '') {
            setQuestions([...questions, newQuestion]);
            setNewQuestion('');
        }
    };

    return (
    <div className="bg-white p-8">
       
        <div className="flex items-center justify-between mb-6">
            <h2 className='text-3xl font-bold text-blue-900'>Practice Question</h2>
            <span className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>

      
        <div className={`bg-slate-50  p-6 mb-6 transition-all duration-300 ${
    isQuestionChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
}`}>
            <p className="text-xl text-slate-800 leading-relaxed">
                {questions[currentQuestionIndex]}
            </p>
        </div>
        
        
        <div className="mb-6 text-center bg-slate-100  py-4">
            <span className="text-4xl font-bold text-blue-900 font-mono">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>
            <span className="text-sm text-orange-600 ml-3 font-semibold">
                {isListening ? '● Recording...' : ''}
            </span>
        </div>

       
        <div className="mb-8 flex gap-3 justify-center">
            <button
                onClick={isListening ? stopListening : startListening}
                className={`px-8 py-3  font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                    isListening
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isListening ? 'Stop Recording' : 'Start Recording'}
            </button>    
            
            <button
                onClick={getRandomQuestion}
                className="px-8 py-3 font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 transform hover:scale-105"
            >
                Next Question
            </button>
        </div>

       
        <div className='mb-8 border-t-2 border-slate-200 pt-6'>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Add Your Own Question</h3>
            <div className="flex gap-3">
                <input 
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter a behavioral question..."
                    className="flex-1 px-4 py-3 border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
                <button
                    onClick={addQuestion}
                    className="px-8 py-3 font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 transform hover:scale-105"
                >
                    Add
                </button>
            </div>
        </div>

        
        {transcript && (
            <div className='bg-slate-50 p-6 border-l-4 border-blue-600'>
                <h3 className='text-xl font-bold text-blue-900 mb-3'>Your Answer:</h3>
                <p className='text-slate-700 text-lg leading-relaxed'>{transcript}</p>
            </div>
        )}
    </div>
);
}