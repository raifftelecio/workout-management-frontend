"use client";

import { useEffect, useState, useRef } from "react";
import { useQueryState, parseAsBoolean } from "nuqs";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Streamdown } from "streamdown";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CHAT_API_URL =
  typeof process.env.NEXT_PUBLIC_API_URL !== "undefined"
    ? `${process.env.NEXT_PUBLIC_API_URL}/ai`
    : "/ai";

function getMessageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && "text" in p)
    .map((p) => p.text)
    .join("");
}

const SUGGESTED_MESSAGE = "Monte meu plano de treino";

export function ChatOverlay() {
  const [chatOpen, setChatOpen] = useQueryState("chat_open", parseAsBoolean);
  const [chatInitialMessage, setChatInitialMessage] = useQueryState(
    "chat_initial_message"
  );
  const [input, setInput] = useState("");
  const initialSentRef = useRef(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: CHAT_API_URL,
      credentials: "include",
    }),
  });

  useEffect(() => {
    if (
      !chatOpen ||
      !chatInitialMessage ||
      messages.length > 0 ||
      initialSentRef.current
    )
      return;
    initialSentRef.current = true;
    sendMessage({ text: chatInitialMessage });
    setChatInitialMessage(null);
  }, [
    chatOpen,
    chatInitialMessage,
    messages.length,
    sendMessage,
    setChatInitialMessage,
  ]);

  useEffect(() => {
    if (!chatOpen) initialSentRef.current = false;
  }, [chatOpen]);

  const handleClose = () => {
    setChatOpen(null);
    setChatInitialMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || status !== "ready") return;
    sendMessage({ text });
    setInput("");
  };

  const handleSuggestion = () => {
    if (status !== "ready") return;
    sendMessage({ text: SUGGESTED_MESSAGE });
  };

  if (!chatOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        aria-hidden
        onClick={handleClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 flex h-[801px] max-h-[85vh] w-full max-w-[393px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden px-4 pt-[160px] pb-4">
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-[20px] bg-card">
          <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
            <div className="flex gap-2 items-center min-w-0">
              <div className="flex shrink-0 items-center justify-center rounded-full border border-primary/10 bg-primary/10 p-3">
                <Sparkles className="size-[18px] text-primary" />
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="text-base font-semibold leading-[1.05] text-foreground truncate">
                  Coach AI
                </p>
                <div className="flex gap-1 items-center">
                  <div className="size-2 shrink-0 rounded-full bg-primary" />
                  <p className="text-xs leading-[1.15] text-primary">Online</p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 size-6"
              aria-label="Fechar"
              onClick={handleClose}
            >
              <X className="size-6 text-foreground" />
            </Button>
          </div>

          <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="flex flex-col gap-5 p-5">
                {messages.length === 0 && (
                  <div className="rounded-xl bg-secondary px-3 py-3">
                    <p className="text-sm leading-normal text-foreground">
                      Olá! Sou sua IA personal. Como posso ajudar com seu treino
                      hoje?
                    </p>
                  </div>
                )}
                {messages.map((message) => {
                  const text = getMessageText(message.parts);
                  const isUser = message.role === "user";
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-3 ${
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        {isUser ? (
                          <p className="text-sm leading-normal whitespace-pre-wrap">
                            {text}
                          </p>
                        ) : (
                          <div className="text-sm leading-normal prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
                            <Streamdown>{text}</Streamdown>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-card">
              {messages.length === 0 && (
                <div className="flex gap-2.5 flex-wrap px-5 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full bg-primary/10 px-4 py-2 text-sm font-normal text-foreground hover:bg-primary/20"
                    onClick={handleSuggestion}
                  >
                    {SUGGESTED_MESSAGE}
                  </Button>
                </div>
              )}
              <form
                className="flex items-center justify-between gap-2 p-5"
                onSubmit={handleSubmit}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem"
                  className="flex-1 rounded-full border-border bg-muted"
                  disabled={status !== "ready"}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0 size-[42px] rounded-full"
                  disabled={status !== "ready" || !input.trim()}
                  aria-label="Enviar"
                >
                  <ArrowUp className="size-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
