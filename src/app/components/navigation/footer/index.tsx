// app/footer.tsx

// Import necessary modules
import Link from 'next/link';
import { FaGithub, FaTwitter, FaInstagramSquare, FaFacebook } from 'react-icons/fa';
import { SocialIcons } from '../../SocialIcons';


// Define the Footer component
export default function Footer() {
    return (
        <footer className='flex w-full p-4 bg-red-500 justify-between'>
            {/* First section of the footer */}
            <div>
                {/* Display your name and the current year */}
                <p>B4tech - Tecnology &copy; {new Date().getFullYear()}</p>
            </div>
            {/* Second section of the footer */}

            <SocialIcons />

            {/* <div className='ml-4'>
                Provide a link to your Twitter profile
                <a href="https://twitter.com/your-username">
                    Connect on Twitter
                </a>
            </div> */}
        </footer>
    );
}
