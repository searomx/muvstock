// app/footer.tsx

// Import necessary modules
import Link from 'next/link';
import { FaGithub, FaTwitter, FaInstagramSquare, FaFacebook } from 'react-icons/fa';
import { SocialIcons } from '../../SocialIcons';


// Define the Footer component
export default function Footer() {
  return (
    <footer className='flex min-w-full p-4 bg-slate-200 justify-between rounded-b-sm'>
      <div>
        <p className='shadow-md shadow-zinc-700 p-2'>B4tech - Tecnology &copy; {new Date().getFullYear()}</p>
      </div>
      <SocialIcons />
    </footer>
  );
}
