import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createIssue, checkIssueSimilarity, clearSimilarity } from '../features/issues/issueSlice'
import SimilarIssuesModal from './SimilarIssuesModal'
import toast from 'react-hot-toast'
import { FiImage, FiSend, FiX } from 'react-icons/fi'

const CreateIssueForm = () => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)
  const { similarityLoading } = useSelector((state) => state.issues)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [pendingFormData, setPendingFormData] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)) }
  }

  const clearImage = () => { setImage(null); setPreview(null) }

  const resetForm = () => {
    setTitle(''); setDescription(''); clearImage(); setExpanded(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description required'); return
    }
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (image) formData.append('image', image)

    setLoading(true)

    try {
      const result = await dispatch(
        checkIssueSimilarity({ title, description })
      ).unwrap()

      if (result.hasSimilar && result.similarIssues?.length > 0) {
        setPendingFormData(formData)
        setShowModal(true)
        setLoading(false)
        return
      }
      await dispatch(createIssue(formData)).unwrap()
      toast.success('Issue posted!')
      resetForm()
    } catch (err) {
      toast.error(err || 'Failed to post issue')
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setPendingFormData(null)
    dispatch(clearSimilarity())
  }

  const handlePosted = () => {
    resetForm()
  }

  return (
    <>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        border: '1px solid #f1f5f9', padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', flexShrink: 0,
            background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontWeight: 600 }}>
              {userInfo?.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          {!expanded ? (
            <button onClick={() => setExpanded(true)} style={{
              flex: 1, textAlign: 'left', fontSize: '14px', color: '#94a3b8',
              backgroundColor: '#f8fafc', padding: '10px 16px', borderRadius: '12px',
              border: '1px solid #e2e8f0', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
            }}>
              Report a campus issue...
            </button>
          ) : (
            <form onSubmit={handleSubmit} style={{ flex: 1 }}>
              <input
                type="text" placeholder="Issue title *" value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%', fontSize: '14px', fontWeight: 600,
                  padding: '4px 0', border: 'none', borderBottom: '2px solid #e2e8f0',
                  outline: 'none', backgroundColor: 'transparent', marginBottom: '12px',
                  fontFamily: 'Inter, sans-serif', color: '#0f172a'
                }}
              />
              <textarea
                placeholder="Describe the issue in detail... *" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={3}
                style={{
                  width: '100%', fontSize: '13px', padding: '4px 0',
                  border: 'none', borderBottom: '1px solid #f1f5f9',
                  outline: 'none', backgroundColor: 'transparent',
                  resize: 'none', marginBottom: '12px',
                  fontFamily: 'Inter, sans-serif', color: '#374151'
                }}
              />
              {preview && (
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }} />
                  <button type="button" onClick={clearImage} style={{
                    position: 'absolute', top: '8px', right: '8px',
                    padding: '4px', backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer'
                  }}>
                    <FiX size={12} />
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', color: '#64748b', cursor: 'pointer',
                  padding: '8px 12px', borderRadius: '8px'
                }}>
                  <FiImage size={15} /> Add Image
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button"
                    onClick={() => { setExpanded(false); setTitle(''); setDescription(''); clearImage() }}
                    style={{
                      padding: '8px 16px', fontSize: '13px', color: '#64748b',
                      backgroundColor: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer'
                    }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading || similarityLoading} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', fontSize: '13px', fontWeight: 600,
                    backgroundColor: '#2563eb', color: 'white',
                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                    opacity: (loading || similarityLoading) ? 0.6 : 1
                  }}>
                    {similarityLoading
                      ? 'Checking...'
                      : loading
                        ? 'Posting...'
                        : <><FiSend size={13} /> Post Issue</>
                    }
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/*Similar Issues Modal */}
      {showModal && pendingFormData && (
        <SimilarIssuesModal
          formData={pendingFormData}
          onClose={handleModalClose}
          onPosted={handlePosted}
        />
      )}
    </>
  )
}

export default CreateIssueForm