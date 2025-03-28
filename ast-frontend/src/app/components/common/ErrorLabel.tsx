export default function ErrorLabel(props: { message: string }) {
  return <p className="text-red-500 text-xs italic">{props.message}</p>;
}
