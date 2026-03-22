import React from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'motion/react'

type QAPasswordPromptModalProps = {
  passwordInput: string
  onPasswordInputChange: (value: string) => void
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const QAPasswordPromptModal = ({
  passwordInput,
  onPasswordInputChange,
  onClose,
  onSubmit,
}: QAPasswordPromptModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">비밀번호 확인</h3>
          <button onClick={onClose}>
            <Plus className="rotate-45" size={20} />
          </button>
        </div>
        <p className="text-sm text-sage-600 mb-4">
          비공개 글입니다. 작성 시 입력한 비밀번호를 입력해주세요.
        </p>
        <form onSubmit={onSubmit}>
          <input
            type="password"
            className="w-full p-3 border border-sage-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-sage-200"
            placeholder="비밀번호"
            value={passwordInput}
            onChange={e => onPasswordInputChange(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-3 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900 transition-colors"
          >
            확인
          </button>
        </form>
      </motion.div>
    </div>
  )
}
