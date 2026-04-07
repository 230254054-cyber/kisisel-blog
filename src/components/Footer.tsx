export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Mehmet Emin Aydoğdu. Built with React & MongoDB.
          </div>
          <div className="flex space-x-6">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              mehmeteminaydogdu498@gmail.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
