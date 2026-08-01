import React from 'react'
import animationData from '@/assets/Shopping-Loader.json'
import LottieComponent from 'lottie-react'

const Lottie = LottieComponent.default || LottieComponent

const ScreenLoader = () => {
    return (
        <div className="min-h-dvh flex justify-center items-center">
            <div className="w-1/2">
                <Lottie animationData={animationData} />
            </div>
        </div>
    )
}

export default ScreenLoader