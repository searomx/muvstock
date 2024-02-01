import { FaGithub, FaTwitter, FaInstagramSquare, FaFacebook } from 'react-icons/fa';
export function SocialIcons() {
    return (
        <div className="flex gap-x-4">
            {/* Twitter icon */}
            <a
                href="https://twitter.com/flaxyz"
                target="_blank"
                rel=""
            >
                <FaTwitter className="text-white hover:text-gray-300" />
            </a>
            {/* Instagran icon */}
            <a
                href="#"
                target="_blank"
                rel=""
            >
                <FaInstagramSquare className="text-white hover:text-gray-300" />
            </a>
            {/* Instagran icon */}
            <a
                href="#"
                target="_blank"
                rel=""
            >
                <FaFacebook className="text-white hover:text-gray-300" />
            </a>
            {/* Add more social media icons as needed */}
        </div>
    );
}