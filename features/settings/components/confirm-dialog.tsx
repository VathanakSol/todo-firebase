"use client";

import type { FormEvent, ReactNode } from "react";
import { AlertDialog } from "radix-ui";
import { Button } from "@/components/ui/button";

// A modal that asks the user to confirm something that cannot be undone.
// Radix's AlertDialog keeps keyboard focus inside the modal, closes it on Escape,
// and returns focus to the button that opened it.
export function ConfirmDialog({ open, onClose, title, description, confirmLabel, cancelLabel, busy, onConfirm, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  /** While the action runs, the buttons are disabled and the modal cannot be closed. */
  busy: boolean;
  onConfirm: () => void;
  /** Extra fields to fill in before confirming, such as a password. */
  children?: ReactNode;
}) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onConfirm();
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => { if (!next && !busy) onClose(); }}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-[#253029]/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-[#e6e9e1] bg-white p-6 shadow-[0_30px_70px_-30px_rgba(38,65,46,0.45)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none">
          <AlertDialog.Title className="text-lg font-semibold text-[#253029]">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-[#718076]">{description}</AlertDialog.Description>
          {/* A form, so that pressing Enter in a field confirms and required fields are checked. */}
          <form onSubmit={submit}>
            {children}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <Button type="button" variant="outline" className="h-10 rounded-[10px] border-[#dfe5dc] bg-transparent px-4 text-[#304d3a] hover:bg-[#f1f6ef]" disabled={busy}>{cancelLabel}</Button>
              </AlertDialog.Cancel>
              <Button type="submit" className="h-10 rounded-[10px] bg-[#a14f42] px-4 text-white hover:bg-[#8c4337]" disabled={busy}>{confirmLabel}</Button>
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
