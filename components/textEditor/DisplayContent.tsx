import DOMPurify from "isomorphic-dompurify";


interface BlogContentProps {
  content: string;
}

const DisplayContent: React.FC<BlogContentProps> = ({ content }) => {
  // Make sure content is a valid HTML string
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none mx-auto"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
export default DisplayContent;