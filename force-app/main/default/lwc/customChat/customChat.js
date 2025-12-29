import { LightningElement, track } from "lwc";
import createChatGenerations from "@salesforce/apex/ModelsAPIChatGenerations.createChatGenerations";

export default class CustomChat extends LightningElement {
  @track messages = []; // Array to store chat messages
  userMessage = ""; // User input message
  isLoading = false; // Track loading state

  // Handle user input change
  handleInputChange(event) {
    this.userMessage = event.target.value;
  }

  // Scroll to the bottom of the chat container
  renderedCallback() {
    this.scrollToBottom();
  }

  // Handle send message button click
  handleSendMessage() {
    if (this.userMessage.trim()) {
      const userMessageObj = {
        id: this.messages.length + 1,
        text: this.userMessage,
        role: "user",
        isUser: true,
      };

      // Add user message to the messages array
      this.messages = [...this.messages, userMessageObj];
      this.isLoading = true; // Show loading indicator

      // Prepare message array for API call
      let messageArray = this.messages.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        message: msg.text,
      }));

      // Call Apex method to fetch chat response
      createChatGenerations({ input: JSON.stringify(messageArray) })
        .then((result) => {
          this.simulateTypingEffect(result);
        })
        .catch((error) => {
          console.error("Error fetching bot response", JSON.stringify(error));
        })
        .finally(() => {
          this.isLoading = false; // Hide loading indicator
        });

      this.userMessage = ""; // Clear user input
    }
  }

  // Simulate typing effect for the chat response
  simulateTypingEffect(fullText) {
    const words = fullText.split(" ");
    let currentIndex = 0;
    let displayText = "";

    const intervalId = setInterval(() => {
      if (currentIndex < words.length) {
        displayText += words[currentIndex] + " ";
        const botResponseObj = {
          id: this.messages.length + 1,
          text: displayText.trim(),
          role: "assistant",
          isUser: false,
        };
        // Replace the last message if it’s the bot’s typing message
        if (currentIndex > 0) {
          this.messages.splice(this.messages.length - 1, 1, botResponseObj);
        } else {
          this.messages = [...this.messages, botResponseObj];
        }
        this.scrollToBottom();
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 30); // Adjust typing speed (ms per word)
  }

  // Scroll to the bottom of the chat container
  scrollToBottom() {
    const chatContainer = this.template.querySelector(".slds-scrollable_y");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
}