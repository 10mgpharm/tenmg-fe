const NoticeCard = ({
  setOpen,
  isVisible,
  status,
}: {
  setOpen: () => void;
  isVisible?: boolean;
  status?: string;
}) => {
  if (!isVisible) return null;

  return (
    <div className="rounded-lg p-5 bg-[#082552]">
      {status && status === "AWAITING_APPROVAL" ? (
        <>
          <h2 className="text-xl font-semibold text-white">
            Your Account Setup is in Progress
          </h2>
          <p className="font-normal text-lg mt-2 text-white">
            Awaiting Approval...
          </p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-semibold text-white">
            Complete your account setup to access all features
          </h2>
          <p className="font-normal text-lg mb-16 mt-2 text-white">
            Let&apos;s get you set up!
          </p>
          <div className="mb-5">
            <button
              onClick={() => setOpen()}
              className="bg-primary-400 text-white p-4 rounded-lg z-0"
            >
              Complete my account setup
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NoticeCard;
