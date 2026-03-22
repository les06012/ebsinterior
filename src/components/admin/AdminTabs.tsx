import React from 'react'
import { Image, MessageSquare } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '../Common'

type AdminTab = 'gallery' | 'qa'

type AdminTabsProps = {
  activeTab: AdminTab
  onChange: (tab: AdminTab) => void
}

export const AdminTabs = ({ activeTab, onChange }: AdminTabsProps) => {
  return (
    <div className="flex gap-2 md:gap-4 mb-8 border-b border-sage-200 overflow-x-auto">
      <button
        onClick={() => onChange('gallery')}
        className={cn(
          'pb-4 px-2 md:px-4 font-bold text-sm md:text-lg transition-colors relative whitespace-nowrap flex-shrink-0',
          activeTab === 'gallery'
            ? 'text-sage-900'
            : 'text-sage-400 hover:text-sage-600',
        )}
      >
        <span className="flex items-center gap-1.5 md:gap-2">
          <Image className="w-4 h-4 md:w-5 md:h-5" /> 포트폴리오 관리
        </span>
        {activeTab === 'gallery' && (
          <motion.div
            layoutId="adminTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-900"
          />
        )}
      </button>
      <button
        onClick={() => onChange('qa')}
        className={cn(
          'pb-4 px-2 md:px-4 font-bold text-sm md:text-lg transition-colors relative whitespace-nowrap flex-shrink-0',
          activeTab === 'qa'
            ? 'text-sage-900'
            : 'text-sage-400 hover:text-sage-600',
        )}
      >
        <span className="flex items-center gap-1.5 md:gap-2">
          <MessageSquare className="w-4 h-4 md:w-5 md:h-5" /> 문의게시판 관리
        </span>
        {activeTab === 'qa' && (
          <motion.div
            layoutId="adminTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-900"
          />
        )}
      </button>
    </div>
  )
}
