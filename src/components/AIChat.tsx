// AIChat.tsx

import React, { useState } from "react";
import { Provider } from "react-redux";

import { aiplaygroundstore } from "../aiplaygroundstore";

// Import styles
// import styles from "../features/counter/Counter.module.css";
import "../App.css";

// Import components
import Dialog from "../modules/MyDialog";

interface WebFormProps {
  onSubmit: (formData: { myPrompt: string }) => Promise<void>;
  promptHistory: string[];
}

function EditableTextModule({
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
          className={isEditing ? "hasBorder1" : "noBorder1"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={isEditing ? "hasBorder1" : "noBorder1"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h2>
      );
    case "h3":
      return (
        <h3
          className={isEditing ? "hasBorder1" : "noBorder1"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h3>
      );
    case "h4":
      return (
        <h4
          className={isEditing ? "hasBorder1" : "noBorder1"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h4>
      );
    case "h5":
      return (
        <h5
          className={isEditing ? "hasBorder1" : "noBorder1"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h5>
      );
    case "h6":
      return (
        <h6
          className={isEditing ? "hasBorder1" : "noBorder1"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </h6>
      );
    case "p":
      return (
        <p
          className={isEditing ? "hasBorder1" : "noBorder1"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </p>
      );
    default:
      return (
        <p
          className={isEditing ? "hasBorder1" : "noBorder1"}
          contentEditable={isEditing}
        >
          {" "}
          {theText}{" "}
        </p>
      );
  }
}

// const DynamicLongAnswer: React.FC<DynamicComponentPropsAlt> = ({
//   componentID,
//   text,
//   isProductionState,
//   // captureState,
// }) => {
//   const [field, setField] = useState("");
//   // const [myCompID, setMyCompID] = useState(componentID);
//   const myCompID = componentID;

//   return (
//     <>
//       <div className="multichoiceBlock">
//         <EditableTextModule
//           myText={String(text)}
//           isEditing={!isProductionState}
//           theFontSize={"p"}
//         />
//         <br />
//         <label>
//           {" "}
//           <input
//             type="textarea"
//             value={field}
//             onChange={(e) => setField(e.target.value)}
//             size={50}
//             aria-multiline="true"
//             maxLength={560}
//           />
//         </label>
//         <br />
//         <p>{isProductionState ? "" : "component ID: " + myCompID}</p>
//       </div>
//       <br />
//     </>
//   );
// };

// Utility function to generate random IDs
const randNum = () => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + 20);
};

// const DynamicLongAnswer: React.FC<DynamicComponentPropsAlt> = ({
//   componentID,
//   text,
//   isProductionState,
//   // captureState,
// }) => {
//   const [field, setField] = useState("");
//   // const [myCompID, setMyCompID] = useState(componentID);
//   const myCompID = componentID;

//   return (
//     <>
//       <div className="multichoiceBlock">
//         <EditableTextModule
//           myText={String(text)}
//           isEditing={!isProductionState}
//           theFontSize={"p"}
//         />
//         <br />
//         <label>
//           <textarea // <- FIX: Use <textarea>
//             value={field}
//             onChange={(e) => setField(e.target.value)}
//             rows={5} // <- Added for better textarea sizing
//             cols={50} // <- Added for better textarea sizing
//             maxLength={560}
//           ></textarea>
//         </label>
//         <br />
//         <p>{isProductionState ? "" : "component ID: " + myCompID}</p>
//       </div>
//       <br />
//     </>
//   );
// };

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
          {promptHistory.map((item, index) => (
            <p key={index} className="promptHistoryItem">
              {item}
            </p>
          ))}
        </div>
      </div>
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

interface AIMessage {
  // Define the structure of your API response here
  content: string;
  reasoning_content: string;
  refusal: undefined;
  role: string;
  // ... other properties
}

interface AIOutputChoice {
  // Define the structure of your API response here
  finish_reason: string;
  index: number;
  logprobs: undefined;
  message: AIMessage;
  // ... other properties
}

interface UsageTracking {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

interface ApiResponse {
  // Define the structure of your API response here
  choices: AIOutputChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: UsageTracking;
  // ... other properties
}

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

const MyFormContainer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openSourceModels = [
    "alibaba-qwen3-32b",
    "openai-gpt-oss-120b",
    "openai-gpt-oss-20b",
  ];

  // const openSourceModelTokenMaximums = [32000, 8192, 8192];
  const [myPromptHistoryAlt, setMyPromptHistoryAlt] = useState<string[]>([]);

  const handleFormSubmit = async (formData: { myPrompt: string }) => {
    setLoading(true);
    setErrorMessage(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // 1. Add user prompt to history immediately
    const userPromptText = "\nuser prompt: " + formData.myPrompt;
    setMyPromptHistoryAlt((prevHistory) => [...prevHistory, userPromptText]);

    // Set a placeholder for the AI response while loading (optional, but good UX)
    // const loadingPlaceholder = "AI: Thinking...";
    // setMyPromptHistoryAlt(prevHistory => [...prevHistory, loadingPlaceholder]);

    const BASE_URL = import.meta.env.VITE_AI_URL;
    const TOKEN = import.meta.env.VITE_AI_MODEL_KEY;

    const url = BASE_URL;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    const customMessage = {
      model: openSourceModels[0],
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

      // 3. CHQ: Gemini AI: Add AI response to history
      const aiResponseText = result.choices[0].message.reasoning_content;
      setMyPromptHistoryAlt((prevHistory) => {
        // You can optionally remove the placeholder here if you added one.
        // For now, just append the AI response.
        return [...prevHistory, "\nAI Response: " + aiResponseText];
      });
    } catch (error) {
      console.error("Error in propmt submission:", error);
      setErrorMessage("Failed to submit prompt. Please try again.");
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
  const [isProduction, setIsProduction] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState({
    confirm: "confirm",
    cancel: "cancel",
  });
  const [modalActions, setModalActions] = useState({
    confirm: () => console.log("confirm"),
    cancel: () => setShowModal(false),
  });

  const formName = "AI Playground";
  const formDescription = "Description of AI Playground";

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
                  <br />
                  <br />
                </header>

                <MyFormContainer />
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
