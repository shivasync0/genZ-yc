export function Footer() {
  return (
    <footer className="bg-background border-t border-gray-200 dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-16">
          
          <div>
            <div className="text-2xl font-black text-foreground tracking-tighter mb-2">GenZ YC.</div>
            <p className="text-sm text-gray-500">Find your co-founder before someone else does.</p>
          </div>

          <div className="flex gap-12 text-sm font-medium">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Manifesto</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Careers</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Contact</a>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-white/5 text-xs text-gray-500 dark:text-gray-600">
          <p>© {new Date().getFullYear()} GenZ YC. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Twitter (X)</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
