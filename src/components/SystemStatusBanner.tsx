export function SystemStatusBanner({ text }: { text: string | null }) {
  if (!text) return null;

  return (
    <div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400
                    bg-gray-50 dark:bg-gray-800 border-t border-gray-200 
                    dark:border-gray-700 animate-fade-in">
      {text}
    </div>
  );
}
