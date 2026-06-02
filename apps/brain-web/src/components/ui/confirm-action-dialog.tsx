"use client";

import { useId, useState } from "react";

import { Button } from "./button";

export interface ConfirmActionDialogProps {
  readonly triggerLabel: string;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly cancelLabel?: string;
  readonly intent?: "default" | "danger";
  readonly disabled?: boolean;
  readonly onConfirm?: () => void;
}

export function ConfirmActionDialog({
  cancelLabel = "Cancel",
  confirmLabel,
  description,
  disabled,
  intent = "default",
  onConfirm,
  title,
  triggerLabel,
}: ConfirmActionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  function handleConfirm() {
    onConfirm?.();
    setIsOpen(false);
  }

  return (
    <>
      <Button
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        variant={intent === "danger" ? "danger" : "secondary"}
      >
        {triggerLabel}
      </Button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            aria-label="Close confirmation dialog"
            className="absolute inset-0 bg-neutral-950/45"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <div
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            className="relative w-full max-w-md rounded-lg border border-neutral-200 bg-white p-5 shadow-xl"
            role="dialog"
          >
            <h2 className="text-base font-semibold text-neutral-950" id={titleId}>
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600" id={descriptionId}>
              {description}
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button onClick={() => setIsOpen(false)} variant="secondary">
                {cancelLabel}
              </Button>
              <Button onClick={handleConfirm} variant={intent === "danger" ? "danger" : "primary"}>
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
