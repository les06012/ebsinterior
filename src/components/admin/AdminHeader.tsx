import React from 'react'
import { Lock, LogOut } from 'lucide-react'

type AdminHeaderProps = {
  onLogout: () => void
}

export const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-white border-b border-sage-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-sage-900 flex items-center gap-2">
          <Lock size={20} className="text-sage-500" />
          관리자 테스트 페이지
        </h1>
        <button
          onClick={onLogout}
          className="text-sm text-sage-500 hover:text-sage-800 flex items-center gap-1"
        >
          <LogOut size={16} /> 로그아웃
        </button>
      </div>
    </header>
  )
}
