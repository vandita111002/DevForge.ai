import { useState } from 'react'

import {
  motion,
  AnimatePresence,
} from 'framer-motion'

import FileCard from './FileCard'
import FileViewerModal from './FileViewerModal'
import ExplainModal from './ExplainModal'
import Skeleton from '../common/Skeleton'

const GeneratedFiles = ({
  files,
  loading,
}) => {

  const [selectedFile, setSelectedFile] = useState(null)

  const [explainFile, setExplainFile] =
    useState(null)

  return (

    <AnimatePresence mode="wait">

      {

        loading ? (

          <motion.div

            key="loading"

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            transition={{
              duration: 0.25,
            }}

            className="w-full flex justify-center"

          >

            <div
              className="
              w-full
              max-w-[1360px]
              mx-auto

              rounded-4xl

              border
              border-white/10

              bg-gradient-to-br
              from-[#081120]
              to-[#050816]

              px-12
              py-10
              "
            >

              <div className="text-center mb-10">

                <h2 className="text-5xl font-bold">

                  Generated Files

                </h2>

                <p className="text-gray-400 text-lg mt-4">

                  Production-ready DevOps configuration

                </p>

              </div>

              <div
                className="
                w-full

                grid
                grid-cols-1
                md:grid-cols-2

                gap-x-12
                gap-y-8

                px-6
                "
              >

                {

                  [1,2,3,4].map((i)=>(

                    <Skeleton
                      key={i}
                      card
                      lines={5}
                      className="w-full h-[230px]"
                    />

                  ))

                }

              </div>

            </div>

          </motion.div>

        ) : (

          <motion.div

            key="content"

            initial={{
              opacity:0,
              y:20,
            }}

            animate={{
              opacity:1,
              y:0,
            }}

            exit={{
              opacity:0,
            }}

            transition={{
              duration:0.35,
            }}

            className="w-full flex justify-center"

          >

            <div
              className="
              w-full
              max-w-[1360px]
              mx-auto

              rounded-4xl

              border
              border-white/10

              bg-gradient-to-br
              from-[#081120]
              to-[#050816]

              px-12
              py-10
              "
            >

              <div className="text-center mb-10">

                <h2 className="text-5xl font-bold">

                  Generated Files

                </h2>

                <p className="text-gray-400 text-lg mt-4">

                  Production-ready DevOps configuration

                </p>

              </div>

              <div
                className="
                w-full

                grid
                grid-cols-1
                md:grid-cols-2

                gap-x-12
                gap-y-8

                px-6
                "
              >

                {

                  files.map((file,index)=>(

                    <FileCard
                      key={index}
                      file={file}
                      onView={() =>
                        setSelectedFile(file)
                      }
                      onExplain={() =>
                        setExplainFile(file)
                      }
                    />

                  ))

                }

              </div>

            </div>

            <FileViewerModal
              file={selectedFile}
              onClose={() =>
                setSelectedFile(null)
              }
            />

            <ExplainModal
              file={explainFile}
              onClose={() =>
                setExplainFile(null)
              }
            />

          </motion.div>

        )

      }

    </AnimatePresence>

  )

}

export default GeneratedFiles