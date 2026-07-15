import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import Header from '../components/layout/Header'
import WorkflowSteps from '../components/workflow/WorkflowSteps'
import ProjectAnalysis from '../components/analysis/ProjectAnalysis'
import GeneratedFiles from '../components/files/GeneratedFiles'
import ErrorAnalyzer from '../components/error/ErrorAnalyzer'
import LiveLogs from '../components/workflow/LiveLogs'
import ProgressBar from '../components/workflow/ProgressBar'
import StatsRow from '../components/analysis/StatsRow'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import {
  setProgress,
  setCurrentStep,
  addLog,
} from '../redux/slices/workflowSlice'

import { getJobStatus } from '../api/analyzeApi'

const DashboardPage = () => {

  const location = useLocation()

  const dispatch = useDispatch()

  const { currentStep } = useSelector(
    state => state.workflow
  )

  const jobId = location.state?.jobId

  const [responseData, setResponseData] =
    useState(null)

  useEffect(() => {

    window.scrollTo(0, 0)

  }, [])

  useEffect(() => {

    if (!jobId) return

    const interval = setInterval(async () => {

      try {

        const job =
          await getJobStatus(jobId)

        dispatch(
          setProgress(job.progress)
        )

        dispatch(
          addLog(job.message)
        )

        switch (job.status) {

          case 'UPLOADING':
          case 'CLONING':
            dispatch(setCurrentStep(1))
            break

          case 'SCANNING':
            dispatch(setCurrentStep(2))
            break

          case 'DETECTING_STACK':
            dispatch(setCurrentStep(3))
            break

          case 'GENERATING':
            // intentionally do nothing
            // card 4 should NOT light up yet
            break

          case 'COMPLETED':

            dispatch(setCurrentStep(4))

            setResponseData(job.response)

            clearInterval(interval)

            break

          case 'FAILED':

            clearInterval(interval)

            break

          default:
            break

        }

      }

      catch (e) {

        console.log(e)

        clearInterval(interval)

      }

    }, 1000)

    return () => clearInterval(interval)

  }, [jobId, dispatch])

  return (

    <div className="min-h-screen bg-[#030712] text-white">

      <Header />

      <main
        className="
        w-full
        max-w-[1700px]

        mx-auto

        px-6
        xl:px-12

        pt-20
        pb-10

        flex
        flex-col

        items-center

        gap-14
        "
      >

        <WorkflowSteps />

        <StatsRow
          data={responseData}
          loading={!responseData}
        />

        <ProjectAnalysis
          data={responseData}
          loading={!responseData}
        />

        <GeneratedFiles
          files={responseData?.generatedFiles || []}
          loading={!responseData}
        />

        <div
  className="
  w-full
  max-w-[1360px]
  mx-auto

  grid
  grid-cols-1
  lg:grid-cols-2

  gap-8
  "
>

          <ProgressBar
            loading={currentStep < 4}
          />

          <LiveLogs
            loading={currentStep < 2}
          />

        </div>

        <div
  className="
  w-full
  max-w-[1370px]
  mx-auto
  "
>
  <ErrorAnalyzer />
</div>

          

      </main>

    </div>

  )

}

export default DashboardPage