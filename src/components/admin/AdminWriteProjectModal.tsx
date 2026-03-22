import React, { useState } from 'react'
import { motion, Reorder } from 'motion/react'
import { Edit2, GripVertical, Plus, Trash2, X } from 'lucide-react'
import { Project } from '../../types'
import { cn } from '../Common'

type AdminWriteProjectModalProps = {
  onClose: () => void
  onSave: (project: Project) => Promise<void>
  onDelete?: (projectId: string) => Promise<void>
  categories: Project['category'][]
  initialData?: Project | null
  isSubmitting?: boolean
}

export const AdminWriteProjectModal = ({
  onClose,
  onSave,
  onDelete,
  categories,
  initialData,
  isSubmitting = false,
}: AdminWriteProjectModalProps) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    category: '주거',
    subCategory: '',
    title: '',
    area: '',
    location: '',
    duration: '',
    scope: '',
    description: '',
    keywords: [],
    thumbnail: '',
    heroImage: '',
    spaces: [],
    details: [],
    comparisons: [],
    ...initialData,
  })

  const [keywordInput, setKeywordInput] = useState('')
  const [spaceName, setSpaceName] = useState('')
  const [spaceDesc, setSpaceDesc] = useState('')
  const [spaceImages, setSpaceImages] = useState<string[]>([])
  const [spaceImageFile, setSpaceImageFile] = useState<File | Blob | null>(null)
  const [editingSpaceIndex, setEditingSpaceIndex] = useState<number | null>(
    null,
  )

  const readImageFile = (file: File, field: 'thumbnail' | 'heroImage') => {
    const reader = new FileReader()
    reader.onload = () => {
      const imageDataUrl =
        typeof reader.result === 'string' ? reader.result : ''
      if (!imageDataUrl) {
        alert('이미지 파일을 읽을 수 없습니다.')
        return
      }
      setFormData(prev => ({
        ...prev,
        [field]: imageDataUrl,
      }))
    }
    reader.onerror = () => {
      alert('이미지 파일을 읽을 수 없습니다.')
    }
    reader.readAsDataURL(file)
  }

  const resetSpaceForm = () => {
    setSpaceName('')
    setSpaceDesc('')
    setSpaceImages([])
    setSpaceImageFile(null)
    setEditingSpaceIndex(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.thumbnail || !formData.heroImage) {
      alert('썸네일 이미지와 메인 이미지를 업로드해주세요.')
      return
    }

    const newProject: Project = {
      ...(formData as Project),
      id: initialData?.id || `project-${Date.now()}`,
      keywords: formData.keywords || [],
      spaces: formData.spaces || [],
      details: formData.details || [],
      comparisons: formData.comparisons || [],
    }
    void onSave(newProject)
  }

  const handleDelete = () => {
    if (!(initialData && onDelete)) return
    if (!window.confirm('이 프로젝트를 Firestore에서 삭제하시겠습니까?')) return

    void onDelete(initialData.id)
  }

  const addKeyword = () => {
    if (!keywordInput.trim()) return

    setFormData(prev => ({
      ...prev,
      keywords: [...(prev.keywords || []), keywordInput.trim()],
    }))
    setKeywordInput('')
  }

  const addSpaceImageFromFile = () => {
    if (!spaceImageFile) return

    const reader = new FileReader()
    reader.onload = () => {
      const imageDataUrl =
        typeof reader.result === 'string' ? reader.result : ''
      if (!imageDataUrl) return
      setSpaceImages(prev => [...prev, imageDataUrl])
      setSpaceImageFile(null)
    }
    reader.onerror = () => {
      alert('이미지 파일을 읽을 수 없습니다.')
    }
    reader.readAsDataURL(spaceImageFile)
  }

  const addOrUpdateSpace = () => {
    if (!(spaceName.trim() && spaceImages.length > 0)) {
      alert('공간 이름과 최소 1장의 이미지를 입력해주세요.')
      return
    }

    if (editingSpaceIndex !== null) {
      setFormData(prev => {
        const updatedSpaces = [...(prev.spaces || [])]
        updatedSpaces[editingSpaceIndex] = {
          name: spaceName.trim(),
          description: spaceDesc.trim(),
          images: spaceImages,
        }
        return { ...prev, spaces: updatedSpaces }
      })
    } else {
      setFormData(prev => ({
        ...prev,
        spaces: [
          ...(prev.spaces || []),
          {
            name: spaceName.trim(),
            description: spaceDesc.trim(),
            images: spaceImages,
          },
        ],
      }))
    }

    resetSpaceForm()
  }

  const editSpace = (index: number) => {
    const spaceToEdit = formData.spaces?.[index]
    if (!spaceToEdit) return

    setSpaceName(spaceToEdit.name)
    setSpaceDesc(spaceToEdit.description || '')
    setSpaceImages(spaceToEdit.images)
    setSpaceImageFile(null)
    setEditingSpaceIndex(index)
  }

  const removeSpace = (index: number) => {
    if (!window.confirm('이 공간을 삭제하시겠습니까?')) return

    setFormData(prev => ({
      ...prev,
      spaces: prev.spaces?.filter((_, i) => i !== index),
    }))

    if (editingSpaceIndex === index) {
      resetSpaceForm()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">
            {initialData ? '프로젝트 수정' : '새 프로젝트 작성'}
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <section className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  카테고리
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={formData.category}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Project['category'],
                    })
                  }
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  세부 카테고리
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.subCategory}
                  onChange={e =>
                    setFormData({ ...formData, subCategory: e.target.value })
                  }
                  placeholder="예: 아파트, 카페"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                프로젝트 제목
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">면적</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.area}
                  onChange={e =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="예: 34평"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">위치</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.location}
                  onChange={e =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  공사 기간
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.duration}
                  onChange={e =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="예: 4주"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  공사 범위
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.scope}
                  onChange={e =>
                    setFormData({ ...formData, scope: e.target.value })
                  }
                  placeholder="예: 전체 리모델링"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea
                className="w-full p-2 border rounded-lg h-24"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">키워드</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-lg"
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  placeholder="키워드 입력 후 추가"
                  onKeyDown={e =>
                    e.key === 'Enter' && (e.preventDefault(), addKeyword())
                  }
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords?.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-sage-100 text-sage-800 rounded text-xs flex items-center gap-1"
                  >
                    #{keyword}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          keywords: prev.keywords?.filter(
                            (_, keywordIndex) => keywordIndex !== index,
                          ),
                        }))
                      }
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                썸네일 이미지 파일
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border rounded-lg"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      readImageFile(file, 'thumbnail')
                    }
                  }}
                />
                {formData.thumbnail && (
                  <img
                    src={formData.thumbnail}
                    alt="썸네일 미리보기"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                메인(히어로) 이미지 파일
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border rounded-lg"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      readImageFile(file, 'heroImage')
                    }
                  }}
                />
                {formData.heroImage && (
                  <img
                    src={formData.heroImage}
                    alt="메인 이미지 미리보기"
                    className="w-full max-w-md h-40 object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">
              공간별 상세 (Spaces)
            </h3>
            <p className="text-sm text-gray-500">
              공간을 드래그하여 순서를 변경할 수 있습니다.
            </p>

            <Reorder.Group
              axis="y"
              values={formData.spaces || []}
              onReorder={newOrder =>
                setFormData(prev => ({
                  ...prev,
                  spaces: newOrder,
                }))
              }
              className="space-y-4 mb-6"
            >
              {formData.spaces?.map((space, index) => (
                <Reorder.Item
                  key={space.name}
                  value={space}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    editingSpaceIndex === index
                      ? 'bg-sage-100 border-sage-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 relative group cursor-grab active:cursor-grabbing',
                  )}
                >
                  {editingSpaceIndex === index ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-sm text-sage-800 flex items-center gap-2">
                          <Edit2 size={14} /> 공간 수정 중...
                        </h4>
                        <button
                          type="button"
                          onClick={resetSpaceForm}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          수정 취소
                        </button>
                      </div>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="공간 이름 (예: 거실, 주방)"
                        value={spaceName}
                        onChange={e => setSpaceName(e.target.value)}
                        autoFocus
                      />
                      <textarea
                        className="w-full p-2 border rounded-lg h-20 bg-white"
                        placeholder="공간에 대한 설명/코멘터리"
                        value={spaceDesc}
                        onChange={e => setSpaceDesc(e.target.value)}
                      />
                      <div>
                        <div className="mb-2 flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e =>
                              setSpaceImageFile(e.target.files?.[0] ?? null)
                            }
                            className="flex-1 p-2 border rounded-lg text-sm bg-white"
                          />
                          <button
                            type="button"
                            onClick={addSpaceImageFromFile}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                          >
                            추가
                          </button>
                        </div>
                        {spaceImages.length > 0 && (
                          <Reorder.Group
                            axis="x"
                            values={spaceImages}
                            onReorder={setSpaceImages}
                            className="flex gap-2 flex-wrap"
                          >
                            {spaceImages.map((image, imageIndex) => (
                              <Reorder.Item
                                key={image}
                                value={image}
                                className="relative group/img cursor-grab active:cursor-grabbing"
                              >
                                <img
                                  src={image}
                                  alt=""
                                  className="w-12 h-12 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSpaceImages(
                                      spaceImages.filter(
                                        (_, idx) => idx !== imageIndex,
                                      ),
                                    )
                                  }
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity z-10"
                                >
                                  <X size={10} />
                                </button>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={addOrUpdateSpace}
                        className="w-full py-2 bg-sage-700 text-white text-sm font-bold rounded-lg hover:bg-sage-800"
                      >
                        공간 수정 완료
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => editSpace(index)}
                          className="text-sage-500 hover:text-sage-700 p-1"
                          title="수정"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSpace(index)}
                          className="text-red-400 hover:text-red-600 p-1"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          <GripVertical size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sage-900 mb-1">
                            {space.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {space.description}
                          </p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {space.images.map((image, imageIndex) => (
                              <img
                                key={imageIndex}
                                src={image}
                                alt=""
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {editingSpaceIndex === null && (
              <div className="bg-sage-50 p-4 rounded-xl border border-sage-100">
                <h4 className="font-bold text-sm text-sage-800 mb-3 flex items-center gap-2">
                  <Plus size={14} /> 새 공간 추가
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="공간 이름 (예: 거실, 주방)"
                    value={spaceName}
                    onChange={e => setSpaceName(e.target.value)}
                  />
                  <textarea
                    className="w-full p-2 border rounded-lg h-20"
                    placeholder="공간에 대한 설명/코멘터리"
                    value={spaceDesc}
                    onChange={e => setSpaceDesc(e.target.value)}
                  />

                  <div>
                    <div className="mb-2 flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e =>
                          setSpaceImageFile(e.target.files?.[0] ?? null)
                        }
                        className="flex-1 p-2 border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={addSpaceImageFromFile}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      >
                        추가
                      </button>
                    </div>
                    {spaceImages.length > 0 && (
                      <Reorder.Group
                        axis="x"
                        values={spaceImages}
                        onReorder={setSpaceImages}
                        className="flex gap-2 flex-wrap"
                      >
                        {spaceImages.map((image, imageIndex) => (
                          <Reorder.Item
                            key={image}
                            value={image}
                            className="relative group cursor-grab active:cursor-grabbing"
                          >
                            <img
                              src={image}
                              alt=""
                              className="w-12 h-12 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setSpaceImages(
                                  spaceImages.filter(
                                    (_, idx) => idx !== imageIndex,
                                  ),
                                )
                              }
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <X size={10} />
                            </button>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={addOrUpdateSpace}
                    className="w-full py-2 bg-sage-800 text-white text-sm font-bold rounded-lg hover:bg-sage-900"
                  >
                    공간 추가하기
                  </button>
                </div>
              </div>
            )}
          </section>

          <div className="pt-4 border-t flex items-center justify-between gap-3">
            <div>
              {initialData && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  프로젝트 삭제
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900 disabled:opacity-50"
            >
              {isSubmitting
                ? '이미지 업로드 중...'
                : initialData
                  ? '수정 완료'
                  : '프로젝트 등록하기'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
