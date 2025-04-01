import "./index.css";
import icon from "/icon.png";
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { pipeline } from "@huggingface/transformers";

import Markdown from "react-markdown"; 
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from 'remark-gfm';
import rehypeHighlight from "rehype-highlight";

function App() {
  const [userInput, setUserInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const maxTokens = 2000;

  const promptAI = async() => {
    setResponse("Processing...");

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userInput },
    ];

    const model = await pipeline(
      "text-generation",
      "Mozilla/Qwen2.5-0.5B-Instruct",
      { dtype: "q8" },
    );
    
    let result = await model(
      messages, 
      { max_new_tokens: maxTokens, do_sample:false },
    );
    
    const text:string = Object(result)[0].generated_text.at(-1).content;
    setResponse(text);
    setUserInput("");
  };
  
  const copyText = () => {
    navigator.clipboard.writeText(response).then(() => {
      alert('Text copied to clipboard');
    });
  };

  return(
    <div>
      <img className="icon" src={icon}/>

      <div className="output">
        <Markdown 
          children={response}
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
        />
      </div>
      
      <div className="row">
        <textarea className="userInput" placeholder="Ask me anything..." onChange={(e) => setUserInput(e.target.value)}/>
        <button onClick={promptAI}>Send</button>
        <button onClick={copyText}>Copy</button>
      </div>

    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
