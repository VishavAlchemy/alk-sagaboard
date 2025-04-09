import React from 'react'
import { useRouter } from 'next/navigation'

const EditProfileButton = () => {
  const router = useRouter()
  return (
    <div>
       <button
                      onClick={() => router.push('/profile/edit')}
                      className="bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded text-sm"
                    >
                      Edit Profile
                    </button>
    </div>
  )
}

export default EditProfileButton
