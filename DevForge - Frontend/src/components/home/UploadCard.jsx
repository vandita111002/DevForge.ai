import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaGithub, FaUpload } from 'react-icons/fa'
import toast from 'react-hot-toast'


import {
  startAnalysis,
  startZipAnalysis,
} from '../../api/analyzeApi'



const UploadCard = () => {

  const [githubLink, setGithubLink] = useState('')
  const [zipFile, setZipFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const MAX_FILE_SIZE_MB = 250
  const fileInputRef = useRef(null)


  

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (
      e.type === 'dragenter' ||
      e.type === 'dragover'
    ) {
      setDragActive(true)
    }

    if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

 const handleDrop = (e) => {

  e.preventDefault()
  e.stopPropagation()

  setDragActive(false)

  const file = e.dataTransfer.files?.[0]

  if (!file) return

  if (!file.name.endsWith('.zip')) {

    toast.error(
      'Only ZIP files are supported'
    )

    return
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {

   toast.error(
  `ZIP file exceeds ${MAX_FILE_SIZE_MB} MB limit`
)

    return
  }

  setZipFile(file)

}

const handleAnalyze = async () => {

  if(loading) return

 // Validate GitHub repository URL

if (!githubLink.trim() && !zipFile) {
    toast.error('Provide GitHub URL or ZIP file')
    return
  }


  if (githubLink.trim()) {

    let url

    try {

      url = new URL(githubLink.trim())

    } catch {

      toast.error('Please enter a valid GitHub repository URL')
      return

    }

    if (url.hostname !== 'github.com') {

      toast.error('Please enter a valid GitHub repository URL')
      return

    }

    const parts = url.pathname
      .split('/')
      .filter(Boolean)

    if (parts.length !== 2) {

      toast.error(
        'Please enter the repository root URL (https://github.com/user/repo)'
      )

      return

    }

  }

  try {
    setIsLoading(true)

   let job

if (zipFile) {

    job = await startZipAnalysis(zipFile)

} else {

    job = await startAnalysis({
        input: githubLink,
    })

}

if (!job.jobId) {

    toast.error('Failed to start analysis')
    return

}

toast.success('Analysis started!')




 navigate('/dashboard', {
  state: {
    jobId: job.jobId,
  },
})

  } catch (error) {

    console.log(error)

    toast.error('Failed to start analysis')

  } finally {

    setIsLoading(false)

  }

}

  return (

    <>
     {/* Loader removed - Dashboard handles loading */}

      <div
        className="
        w-full
        max-w-[850px]

        rounded-[40px]

        px-10
        py-12

        bg-linear-to-br
        from-[#091120]
        via-[#111a30]
        to-[#16254a]

        border
        border-white/10

        backdrop-blur-xl
        shadow-[0_0_50px_rgba(59,130,246,0.08)]
        "
      >

        <div
          className="
          flex
          flex-col
          items-center
          gap-10
          "
        >

          <div
            className="
            flex
            flex-col
            items-center
            "
          >

            <h2
              className="
              text-4xl
              font-bold
              "
            >
              Upload Project
            </h2>

            <p
              className="
              text-gray-400
              text-lg
              mt-4
              "
            >
              Upload ZIP or paste GitHub repository
            </p>

          </div>

          {/* ZIP Upload */}

          <div
            onClick={() =>
              document
                .getElementById('zipUpload')
                .click()
            }

            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}

            className={`
    w-full
    max-w-[700px]

    h-[220px]

    border-2
    border-dashed

    rounded-3xl

    bg-[#0f172a]

    flex
    flex-col
    items-center
    justify-center

    gap-4

    cursor-pointer

    transition-all

    ${dragActive
                ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                : 'border-blue-500/40 hover:border-blue-500'
              }
  `}
          >

            <FaUpload
              className="
              text-5xl
              text-blue-400
              "
            />

            <h3 className="text-xl font-semibold">
              Upload Project ZIP
            </h3>

            <p className="text-gray-400">
              Drag & Drop ZIP here or Click to Browse
            </p>

            {zipFile && (
              <div
                className="
                flex
                flex-col
                items-center
                gap-2
                "
              >

                {zipFile && (
                  <p className="text-green-400 text-sm">
                    {zipFile.name} • {(zipFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()

                    setZipFile(null)

                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="
                  text-red-400
                  text-sm
                  hover:text-red-300
                  "
                >
                  Remove File
                </button>

              </div>
            )}

          </div>

          <input
            ref={fileInputRef}
            id="zipUpload"
            type="file"
            accept=".zip"
            hidden
           onChange={(e) => {

  const file = e.target.files?.[0]

  if (!file) return

  if (!file.name.endsWith('.zip')) {

    toast.error(
      'Only ZIP files are supported'
    )

    e.target.value = ''

    return
  }

  if (file.size > 250 * 1024 * 1024) {

    toast.error(
      'ZIP file exceeds 250 MB limit'
    )

    e.target.value = ''

    return
  }

  setZipFile(file)

}}
          />

          <div
            className="
            text-gray-500
            font-medium
            "
          >
            OR
          </div>

          {/* Github Input */}

          <div
            className="
            w-full
            max-w-[700px]
            "
          >

            <div
              className="
              h-[74px]

              flex
              items-center

              gap-4

              bg-[#0f172a]

              border
              border-white/10

              rounded-2xl

              px-6
              "
            >

              <div
                className="
                w-12
                h-12

                flex
                items-center
                justify-center

                shrink-0
                "
              >

                <FaGithub
                  className="
                  text-[28px]
                  text-gray-500
                  "
                />

              </div>

              <input
                type="text"
                placeholder={
                  zipFile
                    ? 'ZIP selected'
                    : 'https://github.com/username/project'
                }
                value={githubLink}
                onChange={(e) =>
                  setGithubLink(
                    e.target.value
                  )
                }
                disabled={loading || zipFile}
                className="
                w-full
                bg-transparent

                text-lg
                text-white

                placeholder:text-gray-500

                outline-none
                "
              />

            </div>

          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="
            w-full
            max-w-[700px]

            h-[70px]

            rounded-2xl

            bg-linear-to-r
            from-blue-600
            via-blue-500
            to-indigo-500

            font-semibold
            text-lg

            hover:scale-[1.02]

            transition-all

            cursor-pointer
            "
          >

            {
              loading
                ? 'Analyzing Project...'
                : 'Generate DevOps Files'
            }

          </button>

        </div>

      </div>

    </>
  )
}

export default UploadCard