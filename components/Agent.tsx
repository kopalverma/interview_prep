'use client';

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk"; 
import { ca } from "zod/v4/locales";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

// import {type} from "os";
// import type { Message } from "@vapi-ai/web";

// interface AgentProps {
//   userName?: string | null;
//   userId?: string | null;
//   type: "generate" | "practice";
// }

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({ userName, userId , type , interviewId , questions}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    // vapi.on("speech-start", () => setIsSpeaking(true));
    // vapi.on("speech-end", () => setIsSpeaking(false));
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    // vapi.on("error", (e: Error) => console.log("Error:", e));
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      // vapi.off("speech-start", () => setIsSpeaking(true));
      // vapi.off("speech-end", () => setIsSpeaking(false));
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      // vapi.off("error", (e: Error) => console.log("Error:", e));
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log("Generate feedback here.");

    const {success , feedbackId: id} = await createFeedback({
      interviewId: interviewId! ,
      userId: userId! ,
      transcript: messages
    })

    if(success && id){
      router.push(`/interview/${interviewId}/feedback`);
    }else{
      console.log("Error saving feedback.");
      router.push('/');
    }
  }

  useEffect(() => {
    if(callStatus === CallStatus.FINISHED){
      if(type === "generate"){
        router.push('/')
      } else{
        handleGenerateFeedback(messages);
      }
    }
} , [messages , callStatus , type , userId]);

  // ⭐ START ASSISTANT + START WORKFLOW
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(
        undefined,
        undefined,
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
        {
          variableValues: {
            username: userName,
            userid: userId,
          },
        }
      );
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user-avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p className={cn("animate-fadeIn opacity-100")}>
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span>{isCallInactiveOrFinished ? "Call" : ". . ."}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import { vapi, startAssistant } from "@/lib/vapi.sdk";
// import { runWorkflow } from "@/lib/vapi.sdk";

// interface AgentProps {
//   userName?: string | null;
//   userId?: string | null;
// }

// enum CallStatus {
//   INACTIVE = "INACTIVE",
//   CONNECTING = "CONNECTING",
//   ACTIVE = "ACTIVE",
//   FINISHED = "FINISHED",
// }

// interface SavedMessage {
//   role: "user" | "assistant";
//   content: string;
// }

// const Agent = ({ userName, userId }: AgentProps) => {
//   const router = useRouter();
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
//   const [messages, setMessages] = useState<SavedMessage[]>([]);

//   useEffect(() => {
//     vapi.on("call-start", () => setCallStatus(CallStatus.ACTIVE));
//     vapi.on("call-end", () => setCallStatus(CallStatus.FINISHED));
//     vapi.on("speech-start", () => setIsSpeaking(true));
//     vapi.on("speech-end", () => setIsSpeaking(false));

//     vapi.on("message", (m: any) => {
//       if (m.type === "transcript" && m.transcriptType === "final") {
//         setMessages((prev) => [...prev, { role: m.role, content: m.transcript }]);
//       }
//     });

//     return () => vapi.removeAllListeners();
//   }, []);

//   const handleCall = async () => {
//   setCallStatus(CallStatus.CONNECTING);

//   await startAssistant(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
//     username: userName,
//     userid: userId,
//   });

//   await runWorkflow(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
//     userId: userId,
//     userName: userName,
//   });
// };


//   const handleDisconnect = () => {
//     vapi.stop();
//     setCallStatus(CallStatus.FINISHED);
//   };

//   return (
//     <>
//       <div className="call-view">
//         <div className="card-interviewer">
//           <div className="avatar">
//             <Image src="/ai-avatar.png" width={65} height={54} alt="vapi" />
//             {isSpeaking && <span className="animate-speak" />}
//           </div>
//           <h3>AI Interviewer</h3>
//         </div>

//         <div className="card-border">
//           <div className="card-content">
//             <Image src="/user-avatar.png" width={120} height={120} alt="user" className="rounded-full" />
//             <h3>{userName}</h3>
//           </div>
//         </div>
//       </div>

//       {messages.length > 0 && (
//         <div className="transcript-border">
//           <div className="transcript">
//             <p className={cn("animate-fadeIn opacity-100")}>
//               {messages[messages.length - 1]?.content}
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="w-full flex justify-center">
//         {callStatus !== CallStatus.ACTIVE ? (
//           <button className="btn-call" onClick={handleCall}>
//             {callStatus === CallStatus.CONNECTING ? "..." : "Call"}
//           </button>
//         ) : (
//           <button className="btn-disconnect" onClick={handleDisconnect}>End</button>
//         )}
//       </div>
//     </>
//   );
// };

// export default Agent;
