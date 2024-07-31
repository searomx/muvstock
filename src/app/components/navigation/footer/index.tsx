import { FaGithub, FaTwitter, FaInstagramSquare, FaFacebook } from 'react-icons/fa';
import { SocialIcons } from '../../SocialIcons';


// Define the Footer component
export default function Footer() {
  return (
    <footer className='Footer'>
      <div>
        <p className='shadow-md shadow-zinc-700 p-2'>B4tech - Tecnology &copy; {new Date().getFullYear()}</p>
      </div>
      <SocialIcons />
    </footer>
  );
}
