import { FaInstagramSquare, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
export function SocialIcons() {
  return (
    <div className="flex gap-x-4">
      {/* Twitter icon */}
      <a
        href="#"
        target="_blank"
        rel=""
      >
        <FaXTwitter size={24} className="text-gray-700 hover:text-white " />
      </a>
      {/* Instagran icon */}
      <a
        href="#"
        target="_blank"
        rel=""
      >
        <FaInstagramSquare size={24} className="text-pink-600 hover:text-pink-400" />
      </a>
      {/* Instagran icon */}
      <a
        href="#"
        target="_blank"
        rel=""
      >
        <FaFacebook size={24} className="text-blue-700 hover:text-blue-400" />
      </a>
      {/* Add more social media icons as needed */}
    </div>
  );
}
