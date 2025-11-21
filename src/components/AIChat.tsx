// AIChat.tsx

import React, { useState } from "react";
import { Provider } from "react-redux";

import { aiplaygroundstore } from "../aiplaygroundstore";

// Import styles
// import styles from "../features/counter/Counter.module.css";
import "../App.css";

// Import components
import Dialog from "../modules/MyDialog";

import type {
  ChatHistoryItem,
  WebFormProps,
  // AIMessage,
  // AIOutputChoice,
  // UsageTracking,
  ApiResponse,
} from "../utils/dataTypes";

// Utility function to generate random IDs
const randNum = () => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + 20);
};

const WebForm: React.FC<WebFormProps> = ({ onSubmit, promptHistory }) => {
  const [myPrompt, setText] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onSubmit({ myPrompt });
      setText(""); // Clear the form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="formSection" style={{ flex: 1 }}>
          {/* {myList.map((item, index) => item)} */}
          {/* CHQ: Gemini AI helped debug prompts aligning horizontally instead of vertically*/}
          {/* {promptHistory.map((item, index) => ( */}

          {promptHistory.map((item) => (
            <div
              key={item.id}
              className={`chat-message-container ${item.role}`}
            >
              <p className="chat-bubble">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <br></br> <br></br>
      <form onSubmit={handleSubmit}>
        <label>
          Enter prompt:
          <input
            type="text"
            value={myPrompt}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

// Confirmation Modal Component
function ConfirmationModal({
  isModalOpen,
  confirmText,
  cancelText,
  confirmAction,
  cancelAction,
}: {
  isModalOpen: boolean;
  confirmText: string;
  cancelText: string;
  confirmAction: () => void;
  cancelAction: () => void;
}) {
  return (
    <>
      <Dialog open={isModalOpen}>
        <form id="form2" method="dialog">
          <br />
          <label htmlFor="fname">Are you sure?: </label>
          <br />
          <br />
          <input
            className="my_button"
            type="submit"
            onClick={confirmAction}
            value={confirmText}
          />
          <input
            className="my_button"
            type="submit"
            onClick={cancelAction}
            value={cancelText}
          />
        </form>
      </Dialog>
    </>
  );
}

function EditableTextModuleTitle({
  myText,
  isEditing,
  theFontSize,
}: {
  myText: string;
  isEditing: boolean;
  theFontSize: string;
}) {
  const theText = myText;

  switch (theFontSize) {
    case "h1":
      return (
        <h1
          className={isEditing ? "hasBorder2" : "noBorder2"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={isEditing ? "hasBorder2" : "noBorder2"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h2>
      );
    case "h3":
      return (
        <h3
          className={isEditing ? "hasBorder2" : "noBorder2"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h3>
      );
    case "h4":
      return (
        <h4
          className={isEditing ? "hasBorder2" : "noBorder2"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h4>
      );
    case "h5":
      return (
        <h5
          className={isEditing ? "hasBorder2" : "noBorder2"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h5>
      );
    case "h6":
      return (
        <h6
          className={isEditing ? "hasBorder2" : "noBorder2"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h6>
      );
    case "p":
      return (
        <p
          className={isEditing ? "hasBorder2" : "noBorder2"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </p>
      );
    default:
      return (
        <p
          className={isEditing ? "hasBorder2" : "noBorder2"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </p>
      );
  }
}

const MyFormContainer = (props: { modelChoice: string }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // const openSourceModelTokenMaximums = [32000, 8192, 8192];
  //   const [myPromptHistoryAlt, setMyPromptHistoryAlt] = useState<string[]>([]);
  const [myPromptHistoryAlt, setMyPromptHistoryAlt] = useState<
    ChatHistoryItem[]
  >([]);
  const handleFormSubmit = async (formData: { myPrompt: string }) => {
    setLoading(true);
    setErrorMessage(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages
    // 1. Add user prompt to history immediately
    const userPromptItem: ChatHistoryItem = {
      id: randNum(), // Use the utility function defined earlier
      role: "user",
      text: formData.myPrompt, // Store only the text, not the prefix
    };

    // Create a temporary AI message to show while loading
    const loadingId = randNum();
    const loadingItem: ChatHistoryItem = {
      id: loadingId,
      role: "ai",
      text: "Thinking...", // Temporary loading text
    };

    setMyPromptHistoryAlt((prevHistory) => [
      ...prevHistory,
      userPromptItem,
      loadingItem,
    ]);
    const BASE_URL = import.meta.env.VITE_AI_URL;
    const TOKEN = import.meta.env.VITE_AI_MODEL_KEY;

    const url = BASE_URL;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    const customMessage = {
      model: props.modelChoice,
      messages: [
        {
          role: "user",
          content: `${formData.myPrompt}`,
        },
      ],
      max_tokens: 100,
    };

    const theData = customMessage; // Removed redundant myChoice logic
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(theData),
      });

      if (!response.ok) {
        if (response.status >= 400 && response.status < 600) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Server error");
        }
        throw new Error("Failed to submit prompt to AI");
      }

      const result: ApiResponse = await response.json();
      console.log("prompt submission successful:", result);

      // 2. Add final AI response, replacing the temporary loading message
      const aiResponseText = result.choices[0].message.reasoning_content;

      setMyPromptHistoryAlt((prevHistory) => {
        // Remove the loading item and add the final response
        const updatedHistory = prevHistory.filter(
          (item) => item.id !== loadingId
        );
        const finalAIItem: ChatHistoryItem = {
          id: randNum(), // New ID for final message
          role: "ai",
          text: aiResponseText,
        };
        return [...updatedHistory, finalAIItem];
      });
    } catch (error) {
      // ... Error handling remains the same ...
      setErrorMessage(
        "Failed to submit prompt. Please try again." + "\n\n" + error
      );

      // If error, replace loading message with an error message
      setMyPromptHistoryAlt((prevHistory) => {
        const updatedHistory = prevHistory.filter(
          (item) => item.id !== loadingId
        );
        const errorItem: ChatHistoryItem = {
          id: randNum(),
          role: "ai",
          text: "Error: Failed to get response.",
        };
        return [...updatedHistory, errorItem];
      });
    } finally {
      setLoading(false);
    }
  };
  // CHQ: Gemini AI removed addTextToHistory
  return (
    <div>
      {loading && <p>Loading...</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <WebForm promptHistory={myPromptHistoryAlt} onSubmit={handleFormSubmit} />
    </div>
  );
};
const AIChat = () => {
  // const [isProduction, setIsProduction] = useState(false);
  const isProduction = false;
  const [showModal, setShowModal] = useState(false);

  const modalText = {
    confirm: "confirm",
    cancel: "cancel",
  };
  // const [modalText, setModalText] = useState({
  //   confirm: "confirm",
  //   cancel: "cancel",
  // });

  const modalActions = {
    confirm: () => console.log("confirm"),
    cancel: () => setShowModal(false),
  };

  // const [modalActions, setModalActions] = useState({
  //   confirm: () => console.log("confirm"),
  //   cancel: () => setShowModal(false),
  // });

  const formName = "Better Chat AI";
  const formDescription =
    "A better AI Chatbot. Time stamps all prompts and responses.";

  const openSourceModels = [
    "alibaba-qwen3-32b",
    "openai-gpt-oss-120b",
    "openai-gpt-oss-20b",
  ];

  const [indexChoice, setIndexChoice] = useState<number>(0);

  return (
    <>
      <div className="left-part"> </div>
      <>
        <div className="container">
          <Provider store={aiplaygroundstore}>
            <div className="right-div">
              {/* Right div content can go here */}
              <div className="App">
                <header className="App-header">
                  <EditableTextModuleTitle
                    myText={formName}
                    // setMyText={setFormName}
                    isEditing={!isProduction}
                    theFontSize={"h1"}
                  />
                  <EditableTextModuleTitle
                    myText={formDescription}
                    // setMyText={setFormDescription}
                    isEditing={!isProduction}
                    theFontSize={"p"}
                  />
                </header>
                {/* CHQ: Gemini AI: changed onSubmit to onClick for instantaneous update of model*/}
                <button
                  onClick={() => {
                    setIndexChoice(0);
                  }}
                >
                  Choose Qwen
                </button>
                <>{"            "}</>
                {/* CHQ: Gemini AI: changed onSubmit to onClick for instantaneous update of model*/}
                <button
                  onClick={() => {
                    setIndexChoice(1);
                  }}
                >
                  Choose Open AI (Open Source)
                </button>

                <MyFormContainer modelChoice={openSourceModels[indexChoice]} />
                <ConfirmationModal
                  isModalOpen={showModal}
                  confirmText={modalText.confirm}
                  cancelText={modalText.cancel}
                  confirmAction={modalActions.confirm}
                  cancelAction={modalActions.cancel}
                />
              </div>
            </div>
          </Provider>
        </div>
      </>
    </>
  );
};

export default AIChat;
