import { useEffect } from 'react';
import { useSheetToTasks } from '@/context/SheetToTasksContext';

interface UseKeyboardShortcutsProps {
  onNext?: () => void;
  onBack?: () => void;
}

export function useKeyboardShortcuts() {
  const { step, setStep, reset } = useSheetToTasks();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to proceed
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        if (step < 4) {
          // Note: In real steps, we might need validation before moving
          // We'll rely on the components passing a custom onNext if needed
          // For global simplicity, we'll just handle basic navigation here
          setStep(step + 1);
        }
      }

      // Escape to go back
      if (event.key === 'Escape') {
        if (step > 1) {
          setStep(step - 1);
        }
      }

      // Alt + R to start over
      if (event.altKey && event.key === 'r') {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, setStep, reset]);
}
