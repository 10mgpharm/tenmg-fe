import { classNames } from "@/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: "activate" | "suspend" | null;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-md w-[300px]">
        <h2 className="text-lg font-bold mb-4">
          {actionType === "activate" ? "Activate Customer" : "Suspend Customer"}
        </h2>
        <p className="mb-6">
          Are you sure you want to{" "}
          <span
            className={classNames(
              actionType === "activate" ? "text-[#027A48]" : "text-[#B42318]",
              "font-semibold"
            )}
          >
            {actionType === "activate" ? "Activate" : "Suspend"}
          </span>{" "}
          this user?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={classNames(
              actionType === "activate" ? "bg-[#027A48]" : "bg-[#B42318]",
              "px-4 py-2  text-white rounded-md"
            )}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
