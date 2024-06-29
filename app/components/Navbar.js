// src/Navbar.js
import Link from 'next/link';

export function Navbar() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/map">Map</Link>
        </li>
        <li>
          <Link href="/mic">Recorder</Link>
        </li>
      </ul>
    </div>
  );
};