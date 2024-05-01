// components/Chatbot.tsx

import React, { useState } from 'react';
import styles from '../styles/Chatbot.module.css';

const Chatbot: React.FC = () => {
	const [userInput, setUserInput] = useState('');
	const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userInput.trim()) return;

		// Add user message to chat history
		setChatHistory((prevHistory) => [...prevHistory, { user: userInput, bot: '' }]);

		try {
			const response = await fetch('/api/respond', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: userInput, chat_history: chatHistory }),
			});

			const data = await response.json();
			// Add bot response to chat history
			setChatHistory((prevHistory) => {
				const lastMessage = prevHistory[prevHistory.length - 1];
				return [...prevHistory.slice(0, -1), { ...lastMessage, bot: data.bot_message }];
			});
		} catch (error) {
			console.error('Error:', error);
		}

		setUserInput('');
	};

	return (
		<div className={styles.chatbot}>
			<div className={styles.messageList}>
				{chatHistory.map((message, index) => (
					<div key={index}>
						<div className={styles.userMessage}>{message.user}</div>
						<div className={styles.botMessage}>{message.bot}</div>
					</div>
				))}
			</div>
			<form onSubmit={handleSubmit} className={styles.chatForm}>
				<textarea
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					placeholder="Type your question..."
					className={styles.textarea}
					maxLength={512}
					rows={1}
				/>
				<button type="submit" className={styles.generateButton}>
					Send
				</button>
			</form>
		</div>
	);
};

export default Chatbot;