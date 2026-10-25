"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Send } from 'lucide-react';

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ReservationDraft = {
  name: string;
  email: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  occasion: string;
  notes: string;
  readyToSubmit: boolean;
};

const emptyDraft: ReservationDraft = {
  name: "",
  email: "",
  reservationDate: "",
  reservationTime: "",
  guestCount: 0,
  occasion: "",
  notes: "",
  readyToSubmit: false,
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! Welcome to MiniKitchen. I can help you explore our menu or request a table. How can I help?",
    },
  ]);

  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<ReservationDraft>(emptyDraft);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reservationMessage, setReservationMessage] = useState("");

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();

    if (!content || isLoading || isSubmitting) {
      return;
    }

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError("");
    setReservationMessage("");
    setDraft(emptyDraft);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(-20),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The assistant is unavailable.");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((previous) => [...previous, assistantMessage]);

      if (data.reservationDraft?.readyToSubmit === true) {
        setDraft(data.reservationDraft);
      } else {
        setDraft(emptyDraft);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function submitReservation() {
    if (!draft.readyToSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setReservationMessage("");

    try {
      const response = await fetch("/api/chat/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: draft.name,
          email: draft.email,
          reservationDate: draft.reservationDate,
          reservationTime: draft.reservationTime,
          guestCount: draft.guestCount,
          occasion: draft.occasion,
          notes: draft.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit reservation.");
      }

      setReservationMessage(
        `Request submitted successfully. Your reference is ${data.reservationId}. Status: ${data.status}. The restaurant must confirm your request.`,
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Your reservation request has been submitted successfully. It is Pending until the restaurant confirms it.",
        },
      ]);

      setDraft(emptyDraft);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your reservation.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <section
          className="mb-4 flex h-[560px] w-[min(360px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          aria-label="MiniKitchen AI assistant"
        >
          <header className="flex items-center justify-between bg-white border border-b-1 border-gray-200 px-4 py-4 text-white">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Image
                src="/images/chatbot.png"
                alt="MiniKitchen logo"
                width={40}
                height={40}
                className="inline-block rounded-full"
                />
                <div>
                    <span className="ml-2">Minikitchen AI</span>
                    <p className="ml-2 text-xs text-gray-400 font-normal">Menu help and table requests</p>
                </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full px-3 py-1 bg-black text-xl hover:bg-[#d96e3d] cursor-pointer text-white"
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div
            className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "rounded-br-sm bg-emerald-800 text-white"
                      : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <p className="text-sm text-gray-500">
                MiniKitchen is thinking...
              </p>
            )}
          </div>

          {draft.readyToSubmit && !reservationMessage && (
            <div className="border-t bg-white p-4">
              <h3 className="mb-2 font-semibold text-gray-900">
                Review your reservation
              </h3>

              <dl className="space-y-1 text-sm text-gray-700">
                <div>
                  <dt className="inline font-medium">Name: </dt>
                  <dd className="inline">{draft.name}</dd>
                </div>

                <div>
                  <dt className="inline font-medium">Email: </dt>
                  <dd className="inline">{draft.email}</dd>
                </div>

                <div>
                  <dt className="inline font-medium">Date: </dt>
                  <dd className="inline">{draft.reservationDate}</dd>
                </div>

                <div>
                  <dt className="inline font-medium">Time: </dt>
                  <dd className="inline">{draft.reservationTime}</dd>
                </div>

                <div>
                  <dt className="inline font-medium">Guests: </dt>
                  <dd className="inline">{draft.guestCount}</dd>
                </div>

                {draft.occasion && (
                  <div>
                    <dt className="inline font-medium">Occasion: </dt>
                    <dd className="inline">{draft.occasion}</dd>
                  </div>
                )}

                {draft.notes && (
                  <div>
                    <dt className="inline font-medium">Notes: </dt>
                    <dd className="inline">{draft.notes}</dd>
                  </div>
                )}
              </dl>

              <p className="mt-2 text-xs text-amber-700">
                This is a request, not a confirmed booking.
              </p>

              <button
                type="button"
                onClick={submitReservation}
                disabled={isSubmitting}
                className="mt-3 w-full rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit reservation"}
              </button>
            </div>
          )}

          {reservationMessage && (
            <div
              className="border-t bg-emerald-50 p-3 text-sm text-emerald-900"
              role="status"
            >
              {reservationMessage}
            </div>
          )}

          {error && (
            <div
              className="border-t bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={sendMessage}
            className="flex gap-2  bg-white p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about our menu..."
              aria-label="Your message"
              maxLength={2000}
              className="min-w-0 foc flex-1 rounded-lg  px-3 py-2 text-sm outline-none"
            />

            <button
              type="submit"
              disabled={isLoading || isSubmitting || !input.trim()}
              className="rounded-full bg-emerald-800 px-4 py-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Send size={16} color="white" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-black  text-2xl text-white shadow-lg hover:bg-emerald-700"
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        {isOpen ? "×" 
        : <Image
                src="/images/chatbot.png"
                alt="MiniKitchen logo"
                width={60}
                height={60}
                className="inline-block rounded-full"
                />
        }
      </button>
    </div>
  );
}