// /lib/vapi.sdk.ts
import Vapi from "@vapi-ai/web";

// Initialize Vapi client — ONLY assistant calls
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);



// Start assistant
// export const startAssistant = async (
//   assistantId: string,
//   vars?: Record<string, any>
// ) => {
//   return vapi.start(assistantId, {
//     variableValues: vars ?? {}
//   });
// };

// export const runWorkflow = async (workflowId: string, input: any) => {
//   const res = await fetch("/api/run-workflow", {
//     method: "POST",
//     body: JSON.stringify({ workflowId, input }),
//   });
//   return res.json();
// };

