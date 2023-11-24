import React from 'react'
import { PulseLoader } from 'react-spinners'

const FullLoader = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <PulseLoader color="#ef8043" cssOverride={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      </div>
    </section>

  )
}

export default FullLoader;