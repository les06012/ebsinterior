import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { Project } from '../../types'

type AdminGalleryContentProps = {
  projects: Project[]
  onCreate: () => void
  onSelectProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
  isLoadingProjects: boolean
  projectError: string
}

export const AdminGalleryContent = ({
  projects,
  onCreate,
  onSelectProject,
  onDeleteProject,
  isLoadingProjects,
  projectError,
}: AdminGalleryContentProps) => {
  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-lg md:text-2xl font-bold text-sage-900 whitespace-nowrap">
          포트폴리오 목록
        </h2>
        <button
          onClick={onCreate}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-sage-800 text-white text-xs md:text-base font-bold rounded-lg hover:bg-sage-900 flex items-center gap-1.5 md:gap-2 whitespace-nowrap flex-shrink-0"
        >
          <Plus className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          <span className="hidden sm:inline">새 프로젝트 등록</span>
          <span className="sm:hidden">등록</span>
        </button>
      </div>

      {projectError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {projectError}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
        {isLoadingProjects ? (
          <div className="px-6 py-16 text-center text-sm text-sage-500">
            Firestore에서 프로젝트를 불러오는 중입니다.
          </div>
        ) : projects.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-sage-500">
            Firestore `project` 컬렉션에 등록된 프로젝트가 없습니다.
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-sage-50 text-sage-700 text-xs font-bold uppercase tracking-wider border-b border-sage-200">
                  <tr>
                    <th className="p-4 w-24 text-center whitespace-nowrap">
                      썸네일
                    </th>
                    <th className="p-4 w-24 text-center whitespace-nowrap">
                      카테고리
                    </th>
                    <th className="p-4 whitespace-nowrap">프로젝트명</th>
                    <th className="p-4 w-32 text-center whitespace-nowrap">
                      위치
                    </th>
                    <th className="p-4 w-24 text-center whitespace-nowrap">
                      면적
                    </th>
                    <th className="p-4 w-24 text-center whitespace-nowrap">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100">
                  {projects.map(project => (
                    <tr
                      key={project.id}
                      className="hover:bg-sage-50/60 transition-colors group cursor-pointer"
                      onClick={() => onSelectProject(project)}
                    >
                      <td className="p-3 text-center">
                        <img
                          src={project.thumbnail}
                          alt=""
                          className="w-16 h-10 object-cover rounded border border-sage-200 mx-auto"
                        />
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-sage-100 text-sage-700 border border-sage-200">
                          {project.category}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-sage-900 truncate max-w-[300px]">
                        {project.title}
                      </td>
                      <td className="p-4 text-center text-sage-600 text-sm whitespace-nowrap">
                        {project.location}
                      </td>
                      <td className="p-4 text-center text-sage-500 text-sm whitespace-nowrap">
                        {project.area}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={event => {
                            event.stopPropagation()
                            onDeleteProject(project)
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl overflow-hidden border border-sage-200 shadow-sm cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-bold text-sage-800 border border-sage-200">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-sage-900 mb-1 line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-sage-500">
                          {project.location} · {project.area}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={event => {
                          event.stopPropagation()
                          onDeleteProject(project)
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        aria-label={`${project.title} 삭제`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
