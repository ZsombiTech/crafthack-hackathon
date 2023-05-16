import { Link } from "react-router-dom";

interface HeaderProps {
  heading: string;
  paragraph: string;
  linkName: string;
  linkUrl?: string;
}

export default function Header({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}: HeaderProps) {
  return (
    <div className="mb-3">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
        {heading}
      </h2>
      <p className="mt-2 text-center text-sm text-white mt-5">
        {paragraph}
        <Link
          to={linkUrl}
          className="ml-3 font-medium text-blue-600 hover:text-blue-500"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
}
