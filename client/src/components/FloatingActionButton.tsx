import React from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingActionButtonProps {
  onClick: () => void;
  visible?: boolean;
}

export default function FloatingActionButton({ onClick, visible = true }: FloatingActionButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 50 }}
          whileHover={{ 
            scale: 1.1, 
            boxShadow: "0 0 25px rgba(124, 92, 255, 0.6)",
            y: -2 
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={onClick}
          className="fixed bottom-20 md:bottom-8 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-tr from-[#7C5CFF] to-[#6366F1] text-white shadow-md border border-brand-border outline-none focus:ring-2 focus:ring-[#7C5CFF] focus:ring-offset-2 focus:ring-offset-[#0B1020]"
          aria-label="Add transaction"
        >
          <motion.div
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <Plus size={24} strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
