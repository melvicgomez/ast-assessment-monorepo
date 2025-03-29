import ReactMarkdown from 'react-markdown';

export function MessageCard(props: {
  type: 'system' | 'bot' | 'user';
  message: string;
}) {
  const systemClassStyles = 'w-full text-center px-5 italic bold';
  const botClassStyles =
    'w-full max-w-4/6 text-left px-2 py-4 bg-blue-200 shadow-2xs';
  const usersClassStyles =
    'max-w-4/6 text-right self-end px-2 py-4 bg-white shadow-2xs';

  const classToUser =
    props.type === 'bot'
      ? botClassStyles
      : props.type === 'system'
      ? systemClassStyles
      : usersClassStyles;
  return (
    <div className="flex flex-col prose">
      <div className={`${classToUser}`}>
        {props.type === 'bot' ? (
          <ReactMarkdown
            components={{
              code(props) {
                return (
                  <code className="break-words whitespace-pre-wrap">
                    {props.children}
                  </code>
                );
              },
              pre(props) {
                return (
                  <pre className="break-words whitespace-pre-wrap overflow-x-auto">
                    {props.children}
                  </pre>
                );
              },
              table(props) {
                return (
                  <table className="block overflow-x-auto">
                    {props.children}
                  </table>
                );
              },
            }}
          >
            {props.message}
          </ReactMarkdown>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: props.message }} />
        )}
      </div>
    </div>
  );
}
