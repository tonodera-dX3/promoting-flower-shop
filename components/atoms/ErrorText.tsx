type Props = { message?: string | null; id?: string };

export default function ErrorText({ message, id }: Props) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-base text-red-700">
      {message}
    </p>
  );
}
