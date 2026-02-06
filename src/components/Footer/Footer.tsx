
// export default function Footer() {
//   return (
//     <footer className="w-full">
//       <div className="max-w-7xl mx-auto px-4 py-4">
//         <div className="flex justify-center items-center text-xs text-gray-500 gap-2">
//           <a href="#" className="hover:text-gray-700 transition">Terms & conditions</a>
//           <span>|</span>
//           <a href="#" className="hover:text-gray-700 transition">Privacy Policy</a>
//           <span>|</span>
//           <span>© 2026 Tarkasha Labs LLP. All rights reserved.</span>
//         </div>
//       </div>
//     </footer>
//   );
// }

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        
        {/* Desktop */}
        <div className="hidden sm:flex justify-center items-center text-xs sm:text-sm text-gray-500 gap-2 text-center">
          <a href="#" className="hover:text-gray-700 transition">
            Terms & conditions
          </a>
          <span>|</span>
          <a href="#" className="hover:text-gray-700 transition">
            Privacy Policy
          </a>
          <span>|</span>
          <span>© 2026 Tarkasha Labs LLP. All rights reserved.</span>
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden flex-col items-center justify-center text-[11px] text-gray-500 gap-1 text-center">
          <div className="flex gap-2">
            <a href="#" className="hover:text-gray-700 transition">
              Terms & conditions
            </a>
            <span>|</span>
            <a href="#" className="hover:text-gray-700 transition">
              Privacy Policy
            </a>
          </div>

          <div>© 2026 Tarkasha Labs LLP. All rights reserved.</div>
        </div>

      </div>
    </footer>
  );
}
