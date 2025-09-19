import { useState } from 'react'
import DeveloperSkills from './DeveloperSkills'
import DesignSkills from './DesignSkills'

export default function BothFlow() {
  // 0 = developer step, 1 = designer step
  const [step, setStep] = useState<0 | 1>(0)

  return (
    <div className="min-h-screen">
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">
          {step === 0 ? 'Step 1 of 2 · Developer' : 'Step 2 of 2 · Designer'}
        </h1>
      </div>

      <div className="p-4">
        {step === 0 ? <DeveloperSkills /> : <DesignSkills />}
      </div>

      <div className="p-4 flex gap-3 border-t bg-white">
        {step === 1 && (
          <button
            className="px-4 py-2 border rounded"
            onClick={() => setStep(0)}
          >
            Back
          </button>
        )}
        {step === 0 ? (
          <button
            className="ml-auto px-4 py-2 border rounded bg-blue-600 text-white"
            onClick={() => setStep(1)}
          >
            Next
          </button>
        ) : (
          <a
            href="/skills"
            className="ml-auto px-4 py-2 border rounded bg-blue-600 text-white inline-flex items-center justify-center"
          >
            Finish
          </a>
        )}
      </div>
    </div>
  )
}
