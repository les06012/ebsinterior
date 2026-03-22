import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { FAQ } from '../../types'

type QAFaqTabProps = {
  faqs: FAQ[]
  openFaq: number | null
  onToggleFaq: (index: number) => void
}

export const QAFaqTab = ({
  faqs,
  openFaq,
  onToggleFaq,
}: QAFaqTabProps) => {
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-sage-100 overflow-hidden"
        >
          <button
            onClick={() => onToggleFaq(index)}
            className="w-full px-4 py-4 md:px-8 md:py-6 flex items-center justify-between text-left hover:bg-sage-50 transition-colors"
          >
            <span className="font-bold text-sage-800 flex gap-2 md:gap-4 items-center overflow-hidden">
              <span className="text-sage-300 flex-shrink-0">Q.</span>
              <span className="text-xs md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                {faq.question}
              </span>
            </span>
            <span className="flex-shrink-0 ml-2">
              {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </button>

          <AnimatePresence>
            {openFaq === index && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-8 pt-2 text-sm text-sage-600 leading-relaxed flex gap-4">
                  <span className="text-sage-300 font-bold">A.</span>
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
