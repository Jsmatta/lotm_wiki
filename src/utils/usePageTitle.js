import { useEffect } from 'preact/hooks';

export function usePageTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | LOTM Wiki` : 'Lord of the Mysteries Wiki';
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
