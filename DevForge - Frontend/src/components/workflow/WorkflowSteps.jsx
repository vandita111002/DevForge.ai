import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  FaUpload,
  FaBrain,
  FaLayerGroup,
  FaDocker,
  FaCheckCircle,
} from 'react-icons/fa'

import { HiMiniChevronDoubleRight } from 'react-icons/hi2'

const steps = [
  {
    title: 'Upload Project',
    description: 'Upload your code repository or ZIP file',
    icon: <FaUpload />,
    iconColor: 'text-blue-400',
    border: 'border-blue-500/20',
    line: 'from-blue-400',
    glow:
      'shadow-[0_0_22px_rgba(59,130,246,0.18)]',
  },
  {
    title: 'Analyze',
    description: 'AI analyzes your project structure and dependencies',
    icon: <FaBrain />,
    iconColor: 'text-purple-400',
    border: 'border-purple-500/20',
    line: 'from-purple-400',
    glow:
      'shadow-[0_0_22px_rgba(168,85,247,0.18)]',
  },
  {
    title: 'Detect Stack',
    description: 'Identify technologies and frameworks used',
    icon: <FaLayerGroup />,
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/20',
    line: 'from-cyan-400',
    glow:
      'shadow-[0_0_22px_rgba(34,211,238,0.18)]',
  },
  {
    title: 'Generate Files',
    description: 'Generate production-ready DevOps configuration files',
    icon: <FaDocker />,
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
    line: 'from-emerald-400',
    glow:
      'shadow-[0_0_22px_rgba(16,185,129,0.18)]',
  },
]

const WorkflowSteps = () => {

  const { currentStep } = useSelector(
    (state) => state.workflow
  )

  const [visualStep, setVisualStep] = useState(1)

  useEffect(() => {

    setVisualStep(1)

    const timer1 = setTimeout(() => {
      setVisualStep(2)
    }, 6000)

    const timer2 = setTimeout(() => {
      setVisualStep(3)
    }, 12000)

    return () => {

      clearTimeout(timer1)
      clearTimeout(timer2)

    }

  }, [])

  useEffect(() => {

    if (currentStep === 4) {

      setVisualStep(4)

    }

  }, [currentStep])

  return (

    <section
      className="
      w-full
      flex
      justify-center
      mt-6
      "
    >

      <div
        className="
        w-full
        max-w-[1500px]

        flex
        justify-center
        items-center

        gap-10
        flex-wrap
        "
      >

        {steps.map((step, index) => {

          const completed = visualStep > index + 1
          const active = visualStep === index + 1

          return (

            <div
              key={step.title}
              className="relative"
            >

              <div
                className={`
                w-[310px]

                rounded-[30px]
                border

                p-8
                min-h-[270px]

                transition-all
                duration-700

                ${
                  completed
                    ? `
                    ${step.border}
                    bg-[#081120]
                    ${step.glow}
                    opacity-100
                    `
                    : active
                    ? `
                    ${step.border}
                    bg-[#081120]
                    shadow-[0_0_40px_rgba(59,130,246,0.28)]
                    scale-[1.02]
                    opacity-100
                    `
                    : `
                    border-white/10
                    bg-[#081120]
                    opacity-35
                    grayscale
                    `
                }
                `}
              >

                <div className="flex items-center gap-4 mb-6">

                  <div
                    className={`
                    w-[60px]
                    h-[60px]

                    rounded-2xl
                    border

                    flex
                    items-center
                    justify-center

                    text-[28px]

                    ${
                      completed || active
                        ? step.border
                        : 'border-white/10'
                    }

                    ${
                      completed || active
                        ? step.iconColor
                        : 'text-gray-500'
                    }
                    `}
                  >

                    {completed
                      ? <FaCheckCircle />
                      : step.icon}

                  </div>

                  <h3
                    className={`
                    text-2xl
                    font-bold

                    ${
                      completed || active
                        ? 'text-white'
                        : 'text-gray-500'
                    }
                    `}
                  >
                    {step.title}
                  </h3>

                </div>

                <div
                  className={`
                  h-[1px]
                  w-full
                  bg-gradient-to-r

                  ${
                    completed || active
                      ? step.line
                      : 'from-gray-700'
                  }

                  to-transparent
                  mb-6
                  `}
                />

                <p
                  className={`
                  text-[17px]
                  leading-8

                  ${
                    completed || active
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }
                  `}
                >
                  {step.description}
                </p>

              </div>

              {index !== steps.length - 1 && (

                <HiMiniChevronDoubleRight
                  className={`
                  absolute
                  top-1/2
                  -right-8
                  -translate-y-1/2

                  text-[28px]
                  hidden
                  2xl:block

                  ${
                    completed
                      ? 'text-blue-400'
                      : 'text-gray-700'
                  }
                  `}
                />

              )}

            </div>

          )

        })}

      </div>

    </section>

  )

}

export default WorkflowSteps