export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="sh3 rounded-lg border-[1.5px] border-error bg-error text-error px-5 py-3">
      {message}
    </div>
  );
}
