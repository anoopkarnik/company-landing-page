export const chatWithAssistant = async (chatMessage: string) => {
    try {
      const response = await fetch("/api/openAI/nonStreamingAssistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatMessage }),
      });
  
      if (!response.ok) {
        return "Failed to chat with assistant.";
      }
  
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Error in chatWithAssistant:", error);
      return "Sorry, something went wrong.";
    }
  };