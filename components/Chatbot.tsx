// components/Chatbot.tsx
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';  // Ensure the path is correct

const Chatbot: React.FC = () => {
		const [userInput, setUserInput] = useState('');
		const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);
		const [isVisible, setIsVisible] = useState(false); // State to manage visibility of the chatbot

		const handleSubmit = async (e: React.MouseEvent) => {
				e.preventDefault();
				if (!userInput.trim()) return;

				// Add user message to chat history
				const newUserMessage = { user: userInput, bot: '' };
				setChatHistory((prevHistory) => [...prevHistory, newUserMessage]);

				try {
						const response = await fetch('/api/respond', {
								method: 'POST',
								headers: {
										'Content-Type': 'application/json',
								},
								body: JSON.stringify({ message: userInput }),
						});

						const data = await response.json();
						// Update chat history with bot response
						setChatHistory((prevHistory) => {
								const lastIndex = prevHistory.length - 1;
								const lastMessage = { ...prevHistory[lastIndex], bot: data.bot_message };
								return [...prevHistory.slice(0, -1), lastMessage];
						});
				} catch (error) {
						console.error('Error:', error);
				}

				setUserInput('');
		};

		const toggleChatbot = () => {
				setIsVisible(!isVisible);  // Toggle the visibility of the chatbot
		};

		return (
				<>
						<button className={styles.chatbotToggler} onClick={toggleChatbot}>
								<span className="material-symbols-rounded">mode_comment</span>
								<span className="material-symbols-outlined">close</span>
						</button>
						{isVisible && (
								<div className={styles.chatbot}>
										<header>
												<h2>Chatbot</h2>
												<span className={styles.closeBtn} onClick={toggleChatbot}>close</span>
										</header>
										<ul className={styles.chatbox}>
												{chatHistory.map((message, index) => (
														<li key={index} className={message.user ? styles.outgoing : styles.incoming}>
																{message.bot && <span className="material-symbols-outlined">smart_toy</span>}
																<p>{message.user || message.bot}</p>
														</li>
												))}
										</ul>
										<div className={styles.chatInput}>
												<textarea
														value={userInput}
														onChange={(e) => setUserInput(e.target.value)}
														placeholder="Enter a message..."
														spellCheck="false"
														required
												/>
												<span onClick={handleSubmit} className="material-symbols-rounded">send</span>
										</div>
								</div>
						)}
				</>
		);
};

export default Chatbot;