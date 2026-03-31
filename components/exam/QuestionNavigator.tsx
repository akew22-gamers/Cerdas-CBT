'use client'

import { cn } from '@/lib/utils'

interface QuestionNavigatorProps {
  totalQuestions: number
  answeredQuestions: number[]
  currentQuestion: number
  onQuestionSelect: (index: number) => void
}

export function QuestionNavigator({
  totalQuestions,
  answeredQuestions,
  currentQuestion,
  onQuestionSelect
}: QuestionNavigatorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Navigator Soal
      </h3>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const isAnswered = answeredQuestions.includes(num)
          const isCurrent = num === currentQuestion

          return (
            <button
              key={num}
              onClick={() => onQuestionSelect(num)}
              className={cn(
                'aspect-square rounded-lg font-medium text-sm transition-all duration-200',
                'flex items-center justify-center',
                isCurrent && 'ring-2 ring-blue-600 ring-offset-2',
                isAnswered
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {num}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span>Terjawab</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300" />
          <span>Belum diisi</span>
        </div>
      </div>
    </div>
  )
}
