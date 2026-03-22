import React from 'react'
import { motion } from 'motion/react'

type AdminLoginProps = {
  passwordInput: string
  onPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const AdminLogin = ({
  passwordInput,
  onPasswordChange,
  onSubmit,
}: AdminLoginProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-sage-900">관리자 로그인</h2>
          <p className="text-sage-500 text-sm mt-2">
            관리자 계정으로 로그인하세요.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={e => onPasswordChange(e.target.value)}
              className="w-full p-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none transition-all"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900 transition-colors"
          >
            로그인
          </button>
        </form>
      </motion.div>
    </div>
  )
}
