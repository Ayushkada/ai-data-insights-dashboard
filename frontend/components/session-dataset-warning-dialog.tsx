import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

interface SessionDatasetWarningDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SessionDatasetWarningDialog({ open, onConfirm, onCancel }: SessionDatasetWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Active Dataset Warning</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-foreground">
          There is an active dataset in your session. If you add this new dataset, the current session dataset will be deleted. Are you sure you want to continue?
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} autoFocus>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}